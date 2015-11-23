

var vm = {
  clicks:     ko.observable(0),
  main:       ko.observable("Hey You!"),
  buttonText: ko.observable("Click!"),
  inputString:  ko.observable(),
  name:       ko.observable(),
  red:        ko.observable(null),
  previousHash: ko.observable(),
  transactions: ko.observable(),
  timeStamp:  ko.observable(),
  nonce:      ko.observable(),
  blockchain: ko.observableArray(),
  bitcoins:   ko.observable(0),
  message:    ko.observable("Click here to mine some bitcoins!"),
  runner:     function(){},
  activeFunction: function(){
    var cur = list.shift();
    if(typeof cur.a != 'undefined') {
      this.message(cur.a);
    }
    if(typeof cur.b != 'undefined') {
      this.runner = cur.b;
    }
    this.runner();
  },
  buyCPUMine:  function() {
    if(self.bitcoins() < 50) return false;
    miner.speed(miner.iv - 1000);
    self.bitcoins(self.bitcoins() - 50);
    self.clicks("BTC:"+self.bitcoins());
  }
};
var list = [
  {a:"Come on we need more clicks, these are bitcoins we are talking about!"},
  {a:"Yeah, that's it. Clicks are the life blood of bitcoin mining."},
  {a:"Well not really. Clicks have nothing to do with bitcoin mining."},
  {a:"Bitcoins are mined by generating something called 'hashes' using a cryptographic function. Bitcoins use a modified SHA256 algorythm."},
  {a:"This algorythm takes an input like a string of characters or any type of data and processes it using a series of computations in order to generate a uniqe output called a hash."},
  {a:"Lets take a look at a hash in order to get an idea of what I'm talking about."},
  {a:"Ok, this string above is the output from 'hashing' the string 'The Quick Brown Fox'. Any time anyone, anywhere in the world feeds this exact string into the SHA256 algorythm it will always output this exact same sequence.",
   b:function() {
     vm.main(SHA256.hash('The Quick Brown Fox'));
   }},
  {a:"This processes is used to provide proof that a document or an application has not been altered or tampered with, as the resulting hash would be different."},
  {a:"Let's see an example by changing the input from 'The Quick Brown Fox', to 'The Quick Brown Foxx'",
   b:function() {
     vm.main(SHA256.hash('The Quick Brown Foxx'));
   }},
  {a:"As you can see the output hash has changed by just changing the input string by one character. Any small modification of the input string will always change the output hash."},
  {a:"Bitcoin uses this in order to build the blockchain and make sure that every block checks out."}
  {a:"By generating a running sequence of hashes based on known inputs like all the transactions waiting to be confirmed and the hash from the previous 'block'"},
  {a:"A block is a collection of a few inputs like the transactions waiting to be confirmed, a timestamp, the previous hash, and a random number used to change the output hash called the nonce."},
  {a:"Let's have a look at an example of the inputs that go into building a block before we explain the nonce."},
  {a:"Here are our block inputs. This is a simplified example of what all miners use in order to 'mine' for bitcoins.",
   b:function() {
     $("#blockBox").fadeIn("fast");
     vm.transactions(transactionFill());
     vm.timeStamp(new Date());
   }}
];

function vmm() {
  var self = this;

  self.buttonText = ko.observable();
  self.clicks = ko.observable(0);
  self.main = ko.observable("Hey You!");
  self.buttonText = ko.observable("Click!");
  self.inputString = ko.observable();
  self.name = ko.observable();
  self.red = ko.observable(null);
  self.runspeed = ko.observable(4000);
  self.previousHash = ko.observable();
  self.timeStamp = ko.observable();
  self.transactions = ko.observable();
  self.nonce = ko.observable();
  self.blockchain = ko.observableArray();
  self.bitcoins = ko.observable(0);
  self.sortblockchain = ko.computed(function() { return self.blockchain.slice(0).reverse();});
  self.message = ko.observable("Click here to mine some bitcoins!");
  var runner = function() {};
  self.activeFunction = function() {
    var clicks = this.clicks();
    self.clicks(clicks + 1);
    switch(self.clicks()) {
      case 3: self.message("Come on we need more clicks, these are bitcoins we are talking about!");
        break;
      case 8: self.message("Good, bitcoins are mined by generating something called 'hashes' using a cryptographic function. Bitcoins use a modified SHA256 function.");
        break;
      case 15: self.message("Ok, let's fire up the SHA256 hash generator and see some hashes.");
        runner = function(){
          var rand = Math.random() + "A";
          self.main(SHA256.hash(rand));
        }
        break;
      case 24: self.message("Cool we are generating hashes using a random input string. Lets take a look at the input string in the input box.");
        $("#inputString").fadeIn("fast");
        runner = function(){
          var rand = Math.random() + "A";
          self.main(SHA256.hash(rand));
          self.inputString(rand);
        }
        break;
      case 35: self.message("Lets see what your name hashes to. Input your name in the box and click again.");
        runner = function() {self.inputString(null);}
        break;
      case 36:
          if(!self.inputString()){
            self.clicks(35); }
          else {
            self.message("This is the hash calculated from your name. Your name will always cacluate to this string.");
            self.red(true);
            var name = self.inputString();
            self.name(name);
            self.main(SHA256.hash(name)); }
          break;
      case 37: self.message("Ok so we are looking for a hash of a certain difficulty. Lets find one that starts with a 0.");
        self.red(null);
        runner = function() {
          var rand = self.name() + Math.random();
          var hash = SHA256.hash(rand);
          self.main(hash);
          self.inputString(rand);
          if (hash.substring(0,1) == 0) { self.red(true);self.previousHash(hash);self.message("Wow that was fast right? That was a very easy difficutly.");self.clicks(60); }
        }
        break;
      case 61: self.message("Lets try getting one with 2 leading 0s.");
        self.red(null);
        runner = function() {
          var rand = self.name() + Math.random();
          var hash = SHA256.hash(rand);
          self.main(hash);
          self.inputString(rand);
          if (hash.substring(0,2) == 00) { self.red(true); self.message("YOU ARE INCREDIBLY LUCKY! The chances of hitting that going as slow as we are is pretty slim!"); self.clicks(86); }
        }
        break;
      case 86: self.message("Don't worry it's pretty hard to hit that difficutly generating as slow as we are. Let's move on. You are probably wondering how this relates to bitcoins.");
        break;
      case 89: self.message("This is the data that is used to create a block that will be added to the blockchain. This is the 'work' we send to the miners for them to process. We have to create hashes of growing difficutly using this data to confirm transactions and earn bitcoins.");
        self.red(null);
        $("#inputString").fadeOut("fast");
        $("#blockBox").fadeIn("fast");
        self.transactions(transactionFill());
        runner = function() {
          self.timeStamp(new Date());
          self.nonce(Math.random());
          var obj = {"PreviousHash":self.previousHash(),"Transactions":self.transactions(),"TimeStamp":self.timeStamp(),"Nonce":self.nonce()}
          var string = self.previousHash()+self.transactions()+self.timeStamp()+self.nonce();
          var hash = SHA256.hash(string);
          self.main(hash);
        }
        break;
      case 94: self.message("Let's see if we can generate a hash with a leading zero using these inputs.");
        runner = function() {
          self.red(null);
          self.timeStamp(new Date());
          self.nonce(Math.random());
          var obj = {"PreviousHash":self.previousHash(),"Transactions":self.transactions(),"TimeStamp":self.timeStamp(),"Nonce":self.nonce()};
          var string = self.previousHash()+self.transactions()+self.timeStamp()+self.nonce();
          var hash = SHA256.hash(string);
          self.main(hash);
          if (hash.substring(0,1) == 0){
            $("#blockchain").fadeIn("fast");
            self.red(true);
            self.message("Excelent we have generated our first block! Let's see if we can get another.");
            self.blockchain.push({'hash':hash,'inputs':obj});
            self.transactions(transactionFill());
            self.previousHash(hash);
          }
          if(self.blockchain().length == 2) {
            self.bitcoins(50);
            $("#cpuminebutton").fadeIn("fast");
            self.message("Ok clicking kinda sucks so lets buy a CPU Miner which will use our CPU to mine for us.")
            self.buttonText("Mine!");
            activate();
            self.activeFunction = clickMine;
            miner.start(clickMine,4000);
          }
        }
        break;

    }
    runner();


  } // end active function
  var clickMine = function() {
    self.timeStamp(new Date());
    self.nonce(Math.random());
    var string = self.previousHash()+self.transactions()+self.timeStamp()+self.nonce();
    var hash = SHA256.hash(string);
    self.main(hash);
  }


  var miner = {
    running: false,
    iv: 5000,
    timeout: false,
    cb : function(){},
    start : function(cb,iv){
        var elm = this;
        clearInterval(this.timeout);
        this.running = true;
        if(cb) this.cb = cb;
        if(iv) this.iv = iv;
        this.timeout = setTimeout(function(){elm.execute(elm)}, this.iv);
    },
    execute : function(e){
        if(!e.running) return false;
        e.cb();
        e.start();
    },
    stop : function(){
        this.running = false;
    },
    speed : function(iv){
        clearInterval(this.timeout);
        this.start(false, iv);
    }
};

  buyCPUMine = function() {
    if(self.bitcoins() < 50) return false;
    miner.speed(miner.iv - 1000);
    self.bitcoins(self.bitcoins() - 50);
    self.clicks("BTC:"+self.bitcoins());
  }
  function activate() {

    self.hashWatcher = ko.computed(function() {
      var hash = self.main();
      if (hash.substring(0,1) == 0){
        var obj = {"PreviousHash":self.previousHash(),"Transactions":self.transactions(),"TimeStamp":self.timeStamp.peek(),"Nonce":self.nonce.peek()};
        self.blockchain.push({'hash':hash,'inputs':obj});
        self.bitcoins(self.bitcoins() + 25);
        self.clicks("BTC:"+self.bitcoins());
        self.transactions(transactionFill());
        self.previousHash(hash);
        clickMine();
        console.log("Ran Hash watcher  "+hash);
      }
    });

  }// End activate
} // End View Model


function transactionFill() {
  var names = ["Betty","Tom","Billy","Jamie","Howard","Bonnie","Todd","Unice","Gretchen","Ed","Edd","Eddy"];
  var string = "";
  for (var i=0;i<4;i++) {
    string += names[Math.floor(Math.random() * names.length)]+
    " => "+
    names[Math.floor(Math.random() * names.length)]+
    " : "+Math.floor(Math.random() * 5 + 1)+
    "BTC \n";
  }
  return string;
}

$(function() {
  ko.applyBindings(vm);
  $("#mainDiv").fadeIn(1700);
})
