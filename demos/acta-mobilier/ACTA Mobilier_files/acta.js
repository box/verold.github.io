// select TYPES
$('#ftype').on('change', function() {
	checkType();
});
// select FINITIONS
$('#ffiniti').on('change', function() {
	checkCouleurs();
	actualiseInfotype();
});
// select COULEURS
$('#fcol').on('change', function() {
	product.idFinishing_Color = $(this).val();
});
// select NUANCIER
$('#fnu').on('change', function() {
	$('#fnucode').val('');
	$('#fnucode').attr('placeholder', 'Code ' + ($('#fnu option:selected').text()).trim());
});
//$('#submit').on('click', function() {
$("#productform").submit(function(event) {
	// save nuanciers or color
	product.useCustomChart = $("#gnuan").is(":visible");
	$('#cuse').val($("#gnuan").is(":visible"));
	if ($("#gnuan").is(":visible")) {
		product.customChartColorCode = $('#fnucode').val();
		product.customChartCode = $('#fnu').val();
	} else {
		product.idFinishing_Color = $('#fcol').val();
	}
});
$('#modeles .thumbnail').on('click', function() {
	//
	mid = $(this).attr('data-mid');
	if (mid.length > 3) {
		window.location = mid;
	} else {
		window.location = 'modele_details.php?mid=' + mid;
	}
});
$("#cdate").keyup(function() {
	actualiseInfotype();
});
var product = {
	'useCustomChart': false
};

function toggleColors() {
	$("#gcolors").toggle();
	$("#gnuan").toggle();
	product.useCustomChart = $("#gnuan").is(":visible");
	if(product.useCustomChart == false)
	{
		delete product.customChartColorCode;
		$('#fnucode').val('');
	}
}

function setOptions() {
	// check input
	$.each($('#options-panel input'), function(i, item) {
		if (item.checked === true) {
			product.options.push(item.id);
		}
	});
}

function checkDimensions() {
	//console.log('checkDimensions()');
	var fdimh = $('#fdimh').val();
	var fmid = $('#fmid').val();
	var fdiml = $('#fdiml').val();
	var fdimqte = $('#fdimqte').val();
	var fdimep = $('#fdimep').val();
	if (fdimh < 1 || fdimh.length === 0) {
		alert(datastr.dimh);
	} else if (fdiml < 1 || fdiml.length === 0) {
		alert(datastr.diml);
	} else if (fdimqte < 1 || fdimqte.length === 0) {
		alert(datastr.qte);
	} else {
		$('#grouptype').hide();
		$.ajax({
			url: "serv/model.php",
			type: "POST",
			data: '{"action":"getModelTypesBySize","idModel":"' + fmid + '","width":"' + fdiml + '","height":"' + fdimh + '"}',
			success: function(status) {
				if (status.errorCode > 0) {
					alert(status.errorMessage);
				} else {
	console.log(status);
					product = {};
					product.width = fdiml;
					product.height = fdimh;
					product.thickness = fdimep;
					product.quantity = fdimqte;
					addTypes(status.result);
					$('#submit').removeAttr("disabled"); // activate add button
					checkType();
				}
			}
		});
	}
}

function addTypes(data) {
	$('option', $('#ftype')).remove(); // remove options
	$.each(data, function(i, item) {
		$('#ftype').append(new Option(item.name, item.idType)); // add new options
	});
	
	if(myproduct.idType) product.idType = myproduct.idType;
	if (product.idType) {
		$('#ftype').val(product.idType); // set value if known
	}
}

function checkType() {
	//console.log('checkType()');
	$('#grouptype').show();
	var ftype = $('#ftype').val();
	var fmid = $('#fmid').val();
	$.ajax({
		url: "serv/option.php",
		type: "POST",
		data: '{"action":"getOptions","idModel":' + fmid + ',"idType":' + ftype + '}',
		success: function(status) {
			if (status.errorCode > 0) {
				alert(status.errorMessage);
			} else {
				product.idType = ftype;
				product.options = []; //reset options
				if(myproduct.options) product.options = myproduct.options;
				addOptions(status.result);
			}
		}
	});
}

function addOptions(data) {
	if (data.length > 0) {
		$('#groupoptions').show();
	} else {
		$('#groupoptions').hide();
	}
	var item = data[0];
	var datamode = '';
	if (item.type == 'INT') datamode = 'radio';
	if (item.type == 'SELECT') datamode = 'list';
	if (item.type == 'CHECKBOX') datamode = 'checkbox';
	// 1. OPTIONS
	$('#options-panel').empty(); // remove options
	if (datamode == 'list') {
		$('#options-panel').append('<label for="foptions">' + item.label + '</label><select class="form-control" id="foptions" name="options"></select>'); // add select item if list
	}
	if (datamode == "radio") {
		var insert = '<label for="' + datamode + '">'+item.label+'</label><input class="form-control" id="foption" name="options" type="text"/>';
		$('#options-panel').append(insert);
		if (product.options[0]) {
			$('#foption').val(product.options[0]); // set value if known
		}
	} else {
		$.each(item.values, function(i, itek) {
			if (datamode == 'list') {
				$('#foptions').append(new Option(itek.label, itek.idOptionValue)); // add options
			} else {
				var insert = '<div class="' + datamode + '"><input type="' + datamode + '" id="ino' + i + '" name="options[]" value="' + itek.idOptionValue + '"'; // add input options
				if (product.options.indexOf(itek.idOptionValue) > -1) {
					insert += ' checked="checked"';
				}
				insert += '><label for="ino' + i + '">' + itek.label + '</label></div>';
				$('#options-panel').append(insert);
			}
		});
		if (datamode == 'list' && product.options[0]) {
			$('#foptions').val(product.options[0]); // set value if known
		}
	}
}

function addFinitions(data) {
	// 2. FINITIONS
	$.each(data.datas, function(i, item) {
		$('#ffiniti').append(new Option(item.n, item.k)); // add options
	});
	if (product.c_fini) {
		$('#ffiniti').val(product.c_fini); // set value if known
	}
}

function showPageCouleurs(btn) {
	var fid = $(btn).attr('data-fid');
	$('.dfi button').removeClass('btn-danger');
	$(btn).addClass('btn-danger');
	$('#ffiniti').val(fid);
	checkCouleurs();
	actualiseInfotype();
}

function showEmPageCouleurs(btn) {
	var fid = $(btn).attr('data-fid');
	$('.dfi button').removeClass('btn-danger');
	$(btn).addClass('btn-danger');
	$('#ffiniti').val(fid);
	$('#fcol').val("");
	product.c_fini = fid; // set finition;
	
	$('#fcol').val(''); // empty form
	delete product.idFinishing_Color;
	$(".clr-selected").removeClass('clr-selected');
	
	$('.colorblock').hide();
	$('#colors' + fid).show();
	$("#finitions #accordion").show();
	actualiseInfotype();
	$('.clr').on('click', function() {
		// save nuanciers
		$('.clr').removeClass('clr-selected');
		$(this).addClass('clr-selected');
		$('.nuanciers button').removeClass('btn-danger'); //remove selection displayed
		$("#fcol").val($(this).attr("data-cid"));
		product.idFinishing_Color = $(this).attr("data-cid");
		product.useCustomChart = false;
		$('#nucolor').val('');
		actualiseInfotype();
	});
}

function checkCouleurs() {
	//console.log('checkCouleurs()');
	var ffiniti = $('#ffiniti').val();
	addCouleurs(eval($('#colors' + ffiniti).html()));
}

function addCouleurs(data) {
	$('option', $('#fcol')).remove(); // remove options
	$.each(data, function(i, item) {
		if (product.idFinishing_Color === null) {
			product.idFinishing_Color = item.k;
		}
		$('#fcol').append(new Option(item.n, item.k)); // add new options
	});
	if (product.idFinishing_Color) {
		$('#fcol').val(product.idFinishing_Color); // set value if known
	}
}

function editProduct(pid) {
	$.getJSON("pdt.php", {
		dt: '{"pid":"' + pid + '"}'
	}, function(data) {
		product = data.produit;
		$('#fdimh').val(product.height);
		$('#fdiml').val(product.width);
		$('#fdimep').val(product.thickness);
		$('#fdimqte').val(product.quantity);
		$('#fcoms').val(product.comment);
		$('#fnu').val(product.customChartCode);
		$('#fnucode').val(product.customChartColorCode);
		addTypes(data.types.datas);
		addOptions(data.options);
		addFinitions(data.finitions);
		addCouleurs(data.couleurs.datas);
	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		console.log("E Request Failed: " + err);
	});
}

function deleteProduct(pid) {
	if (confirm('Vous allez supprimer ce produit. Continuer ?')) {
		window.location = "devis.html?delete=" + pid;
	} else {
		// Do nothing!
	}
}
// page types

function listTypes() {
	var str = "";
	var fi = "";
	$.each(datatypes, function(i, item) {
		if (fi == "") {
			fi = item.tid;
		}
		str += '<button type="button" class="btn" onclick="showType(this);" data-tid="' + item.tid + '">' + item.name + '</button>';
	});
	$(".panel.types .panel-body #typescnt").html(str);
	showType($('*[data-tid="' + fi + '"]'));
}

function showType(btn) {
	var tid = $(btn).attr('data-tid');
	$('.panel.types .panel-body button').removeClass('btn-danger');
	$(btn).addClass('btn-danger');
	$.each(datatypes, function(i, item) {
		if (item.tid == tid) {
			if (item.p.length > 0) {
				$('#imap').attr('src', item.p);
			} else {
				$('#imap').attr('src', 'images/placeholder.jpg');
			}
			if (item.v.length > 0) {
				$('#imav').attr('src', item.v);
			} else {
				$('#imav').attr('src', 'images/placeholder.jpg');
			}
			//var ht = datastr.h + item.h + '<br/>' + datastr.l + item.l + '<br/>' + datastr.e + item.e;
			var ht = datastr.h + item.h + '<br/>' + datastr.l + item.l;
			if (item.d) {
				ht += '<br/><a href="' + item.d + '" target="_blank"><button type="button" class="btn btn-sm btn-info"><span class="glyphicon glyphicon-zoom-in"></span> ' + datastr.d + '</button></a>';
			}
			$('.infotype .panel-body').html(ht); // body
			ht = '<span class="glyphicon glyphicon-info-sign"></span> ' + item.name;
			$('.infotype .panel-heading').html(ht); // header
			$('.infotype').show();
		}
	});
}

function selectNuancier(btn) {
	var nme = $(btn).text();
	var nid = $(btn).attr('data-nid');
	$('.nuanciers button').removeClass('btn-danger');
	$(btn).addClass('btn-danger');
	$('#save_button').removeAttr("disabled");
	$('#fnu').val(nid);
	$('#nucolor').val();
	delete product.customChartCode;
}

function saveNuancierColor() {
	if ($('#nucolor').val().length > 0) 
	{
		product.useCustomChart = true;
		product.customChartCode = $('#fnu').val();
		product.customChartColorCode = $('#nucolor').val();
		$('#fnucode').val($('#nucolor').val());
		actualiseInfotype();
	} else {
		alert(datastr.n);
	}
}

function actualiseInfotype() {
	var shouldBuy = false;
	var str = '';
	str += datastr.f + $(".dfi .btn-danger").text();
	if (product.useCustomChart == true) {
		str += '<br/>' + datastr.c + product.customChartColorCode + ' (' + $(".nuanciers .btn-danger").text() + ')';
		$('#fcol').val(''); // empty form
		delete product.idFinishing_Color;
		$('.clr').removeClass('clr-selected'); //remove selection displayed
		if (product.customChartColorCode && product.customChartCode && product.c_fini) {
			shouldBuy = true;
		}
	} else {
		str += '<br/>' + datastr.c + $(".clr-selected .caption").text();
		$('#fnu').val('');
		$('#fnucode').val('');
		delete product.customChartCode;
		delete product.customChartColorCode;
		if (product.idFinishing_Color && product.c_fini) {
			shouldBuy = true;
		}
	}
	if ($('#cdate').val().length > 0) {
		if (validateDate($('#cdate').val()) == false) {
			$('#cdate').parent().addClass('has-error');
			shouldBuy = false;
		} else {
			$('#cdate').parent().removeClass('has-error');
		}
	} else {
		shouldBuy = false;
	}
	$('.infotype .panel-body .suite').html(str);
	if (shouldBuy == true) {
		$('.buy button').removeAttr("disabled");
	} else {
		$('.buy button').attr("disabled", "disabled");
	}
}

function validateRegisterForm() {
	$('#regform input').parent().removeClass('has-error');
	prenom = $("#regPre1").val();
	nom = $("#regNom1").val();
	raison = $("#regComp1").val();
	tel = $("#regPhon1").val();
	mail = $("#regEmail1").val();
	p1 = $("#regPass2").val();
	p2 = $("#regPass3").val();
	hasError = false;
	if (prenom.length < 2) {
		$('#regPre1').parent().addClass('has-error');
		hasError = true;
	}
	if (nom.length < 2) {
		$('#regNom1').parent().addClass('has-error');
		hasError = true;
	}
	if (!validateMail(mail)) {
		$('#regEmail1').parent().addClass('has-error');
		hasError = true;
	}
	if (p1 !== p2 || p1.length == 0) {
		$('#regPass2').parent().addClass('has-error');
		$('#regPass3').parent().addClass('has-error');
		hasError = true;
	}
	// "dd": '{"action":"create","user":{"lastName":"'+nom+'","firstName":"'+prenom+'","mail":"'+mail+'","password":"'+p1+'","companyName":"'+raison+'"}}'
	if (hasError == false) {
		$.ajax({
			url: "serv/user.php",
			type: "POST",
			data: '{"action":"create","user":{"lastName":"' + nom + '","firstName":"' + prenom + '","mail":"' + mail + '","password":"' + p1 + '","companyName":"' + raison + '","phone":"' + tel + '"}}',
			success: function(status) {
				if (status.errorCode > 0) {
					alert(status.errorMessage);
				} else {
					window.location = $('#redirect').val();
				}
			}
		});
	}
}

function validateLoginForm() {
	$('#regform input').parent().removeClass('has-error');
	mail = $("#regEmail1").val();
	p1 = $("#regPass2").val();
	hasError = false;
	if (!validateMail(mail)) {
		$('#regEmail1').parent().addClass('has-error');
		hasError = true;
	}
	if (p1.length == 0) {
		$('#regPass2').parent().addClass('has-error');
		hasError = true;
	}
	if (hasError == false) {
		$.ajax({
			url: "serv/auth.php",
			type: "POST",
			data: '{"action":"login","mail":"' + mail + '","password":"' + p1 + '"}',
			datatype: "json",
			success: function(status) 
			{
				if (status.errorCode > 0) {
					alert(status.errorMessage);
				} else {
					window.location = $('#redirect').val();
				}
			}
		});
	}
}
// utilities

function validateDate(dtValue) {
	var dtRegex = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/);
	return dtRegex.test(dtValue);
}

function validateMail(x) {
	var atpos = x.indexOf("@");
	var dotpos = x.lastIndexOf(".");
	if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
		return false;
	}
	return true;
}

function changeHomeSize() {
	var bodyheight = (7 * $(window).width()) / 16;
	$("#contentctr").height(bodyheight);
}