function PocketmanServer()
{
  console.log('PocketmanServer');
}

PocketmanServer.prototype.onInput = function(input) {
  console.log('Game got input: '+input);
}
