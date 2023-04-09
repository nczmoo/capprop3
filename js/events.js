$(document).on('click', '', function(e){

})

$(document).on('change', '.machine', function(e){
	console.log(e.target.id);
	game.changeMachine(Number(e.target.id.split('-')[1]), $("#" + e.target.id).val());
	ui.refresh();
})


$(document).on('click', 'button', function(e){
	ui.refresh()
})
