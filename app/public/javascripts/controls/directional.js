$('.game').live('pagecreate',function(event){
  
  $('form.controls input').unbind('click');
  $('form.controls input').bind('click', function(){
    console.log('Clicked '+$(this).val());
    $.client.sendInput($(this).val());
    return false;
  });
});
