'use strict';

// console.log('js is alive!!');

$('.updateForm').hide();
$('.updateBtn').on('click',()=>{
  $('.updateForm').toggle();
  $('.updateBtn').toggle();
  $('.deleteBtn').toggle();


});


$('.links').hide();
$('.bugerMenuContainer').on('click',()=>{
  $('.links').toggle();
});


