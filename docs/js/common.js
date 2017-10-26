function changeFormType(type){
  if (type) {
    $('#reason').val(type);
  } 
  type = $('#reason').val() || 'general';
  $('#name').focus();
  $('#inquiry-form .form-group').addClass('hide');
  $('#inquiry-form .' + type + '-form').removeClass('hide');
}

$('#inquiry-form').submit(function(e) {
    $('#messages .alert').addClass('hide');
    $.ajax({
      method: "POST",
      url: "email.php",
      data: $('#inquiry-form').serialize()
    })
    .done(function(response) {
      if(response == "Mail sent: 1, 1"){
        $('#inquiry-form')[0].reset();
        $('#messages .alert-success').removeClass('fade hide').delay(5000).queue(function(){
          $(this).addClass('fade').dequeue();
        }).delay(100).queue(function(){
          $(this).addClass('hide').dequeue();
        });
      } else {
        $('span.email').text('admin@atomicuscavaliers.com');
        $('#messages .alert-danger').removeClass('fade hide');
      } 
    })
    .fail(function(response){
      $('span.email').text('admin@atomicuscavaliers.com');
      $('#messages .alert-danger').removeClass('fade hide');
    });
    e.preventDefault();
});