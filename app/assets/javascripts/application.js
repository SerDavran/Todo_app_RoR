// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(document).ready(function() {
      
    $('#new_task').keyup(function (e) {
    	var title = $(this).val();
	  	if (e.keyCode == 13) {
	  		$.ajax
          	({
            	type: "POST",
            	url: "tasks",
            	data: { task: { title: title, state_id: 1 } },
            	dataType: "json",
            	success: function(data) {
            		var div_with_record = "<li id=li_"+data.task.id+" class='list-group-item state_"+data.task.state_id+"'><span id="+data.task.id+" class='glyphicon glyphicon-unchecked' aria-hidden='true'></span><input type='text' id=input_"+data.task.id+" class='form-control input_in' placeholder='"+data.task.title+"' disabled> <a class='trash_right' data-method='delete' href='/tasks/"+data.task.id+"' rel='nofollow'><i class='glyphicon glyphicon-remove'></i></a></li>";
                $(div_with_record).prependTo(".list-group");
                $(".items_left").empty();
                $("<span>"+data.left+"</span>").prependTo(".items_left");
              },
            	error: function(data) { 
                $.each(data.responseJSON, function(i, item) { //Για κάθε data που παίρνω κανω τα παρακάτο 
                alert(i+":"+item); //data.responseJSON
                })
              }
          	});
      $('#new_task').val('');
		  }
    });

    $(document).on('click', '.glyphicon-unchecked, .glyphicon-edit', function(){ 
    	
    	var task_id = $(this).attr('id');
    	var element = $(this);
        $.ajax
        ({
        	type: "PATCH",
        	url: "tasks/"+task_id,
        	data: { task: { state_id: 3 }, _method:'put' },
        	dataType: "json",
            success: function(data) {
              $(".items_left").empty();
              $("<span>"+data.left+"</span>").prependTo(".items_left");
            	//console.log(element.attr('class'));
            	element.removeClass('glyphicon-unchecked glyphicon-edit');
              element.parent().removeClass('state_1 state_2');
            	element.addClass('glyphicon-check');
              element.parent().addClass('state_3');
            },
            error: function(data) { 
            }
        });//ajax
    });//click

    $(document).on('click', '.glyphicon-check', function(){ 
      
      var task_id = $(this).attr('id');
      var element = $(this);
        $.ajax
        ({
          type: "PATCH",
          url: "tasks/"+task_id,
          data: { task: { state_id: 1 }, _method:'put' },
          dataType: "json",
            success: function(data) {
              $(".items_left").empty();
              $("<span>"+data.left+"</span>").prependTo(".items_left");
              //console.log(element.attr('class'));
              element.removeClass('glyphicon-check');
              element.parent().removeClass('state_3');
              element.addClass('glyphicon-unchecked');
              element.parent().addClass('state_1');
            },
            error: function(data) { 
            }
        });//ajax
    });//click

    $(document).on('click', '.glyphicon-chevron-down', function(){   
      $.ajax
      ({
        type: "POST",
        url: "update_all",
        dataType: "json",
          success: function(data) {
            //alert(data);
            $( "li span" ).each(function() {
              if (data == 1){//Active
                if ( $(this).hasClass("glyphicon-check") || $(this).hasClass("glyphicon-edit") ){
                  $( this ).removeClass('glyphicon-check glyphicon-edit');
                  $( this ).parent().removeClass('state_2 state_3');
                  $( this ).addClass('glyphicon-unchecked');
                  $( this ).parent().addClass('state_1');
                }
              }else{//Complited
                if ( $(this).hasClass("glyphicon-unchecked") || $(this).hasClass("glyphicon-edit") ){
                  $( this ).removeClass('glyphicon-unchecked glyphicon-edit');
                  $( this ).parent().removeClass('state_1 state_2');
                  $( this ).addClass('glyphicon-check');
                  $( this ).parent().addClass('state_3');
                }
              }
            });
          },
          error: function(data) { 
          }
      });//ajax
    });//click

    //document.oncontextmenu = function() {return false;};

    $(document).on('contextmenu', '.glyphicon-unchecked, .glyphicon-check', function(e){  
      e.preventDefault(); 
      var task_id = $(this).attr('id');
      var element = $(this);
        $.ajax
        ({
          type: "PATCH",
          url: "tasks/"+task_id,
          data: { task: { state_id: 2 }, _method:'put' },
          dataType: "json",
            success: function(data) {
              $(".items_left").empty();
              $("<span>"+data.left+"</span>").prependTo(".items_left");
              //console.log(element.attr('class'));
              element.removeClass('glyphicon-check glyphicon-unchecked');
              element.parent().removeClass('state_1 state_3');
              element.addClass('glyphicon-edit');
              element.parent().addClass('state_2');
            },
            error: function(data) { 
            }
        });//ajax
    });//dblclick

    $(document).on('click', '.clear_all', function(){ 
        $.ajax
        ({
          type: "POST",
          url: "delete_complited",
          dataType: "json",
            success: function(data) {
              $.each(data, function(i, item) { //Για κάθε data που παίρνω κανω τα παρακάτο 
                $("#li_"+item.id).remove();
                //console.log("#li_"+item.id);
                })
            },
            error: function(data) { 
              //console.log(data);
            }
        });//ajax
    });//click

    $(document).on('click', '.state', function(){ 
        var temp_id = $(this).attr('id').split('_');
        var id = temp_id[1];
        if( id == 0 ){
          $(".list-group-item").show();
        }else{
          $(".list-group-item").hide();
          $(".state_"+id).show();
          $(".list_bottom").show();
        }
        //Remove class with border
        $(".state").removeClass("active_state");
        $(this).addClass("active_state");
        //console.log(".state_"+id);
    });//click

    $(document).on('dblclick', '.input_in', function(evt){  
      var input = $( ".input_in" );
      input.prop("disabled", true);
      input.val("");
      // 
      var input = $( this );
      var placeholder = input.attr('placeholder');
      input.val(placeholder);
      input.prop("disabled", false).focus();
      input.focus();

    });//dblclick

    $('body').click(function(evt){    
      if(evt.target.class == "input_in")
        return;
      if($(evt.target).closest('.input_in').length)
        return;     

      var input = $( ".input_in" );
      input.prop("disabled", true);
      input.val("");
      $("#new_task").focus();

    });

    $(document).on('keyup','.input_in',function( e ) { 
      var title = $(this).val();
      if (e.keyCode == 13) {
        var input = $( this );
        input.prop("disabled", true);
        $("#new_task").focus();
        var title = input.val();
        var arr = input.attr('id').split('_');
        
        $.ajax
          ({
            type: "PATCH",
            url: "tasks/"+arr[1],
            data: { task: { title: title }, _method:'put' },
            dataType: "json",
            success: function(data) {
              //onsole.log(data);
              input.attr("placeholder", data.task.title);
            },
            error: function(data) { 
              $.each(data.responseJSON, function(i, item) { //Για κάθε data που παίρνω κανω τα παρακάτο 
                alert(i+":"+item); //data.responseJSON
              })
            }
        });
            
      }
      if (e.keyCode == 27) {
        var input = $( this );
        input.prop("disabled", true);
        input.val("");
        $("#new_task").focus();
      }
    });

    $( document ).ajaxError(function() {
      location.reload();
    });

});
