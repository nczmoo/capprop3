$(document).on('click', '', function(e){

})

$(document).on('change', '.assignCultureProduct', function(e){
	if ($("#" + e.target.id).val() == ''){
		return;
	}
	game.assignCultureProduct(e.target.id.split('-')[1], $("#" + e.target.id).val());
})

$(document).on('change', '.devAssign', function(e){
	game.assign(e.target.id.split('-')[1], $("#devAssign-" + e.target.id.split('-')[1]).val());
	
})


$(document).on('click', '#devAdd', function(e){
	if ($("#devCulture").val().length == 0 || $("#devGoal").val().length == 0){
		return;
	}
	game.addCulturesToDeveloping($("#devCulture").val(), $("#devGoal").val());
	
});

$(document).on('click', '#devStart', function(e){
	game.startDevelopment();
});


$(document).on('click', 'button', function(e){
	ui.refresh()
})
