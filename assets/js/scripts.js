$(document).ready( function(){

	//criacao do clone dos campos para os dados das moedas
	const estrutura_dados_moeda = $('.dadosMoeda').clone();


	var dados_favoritos = JSON.parse(localStorage.getItem("dados_favoritos") || "[]");


	//variavel dos dados atuais da 
	var dados_atuais_tabela = [];



	var pagina_atual = 'pagina-incial';
	
	
	
	// temporizador para receber e atualizar os dados da api a cada minuto
	let temporizador = setInterval(function(){
		receberDadosAPI();
		atualizarDadosTabela(dados_atuais_tabela);

		dados_favoritos = JSON.parse(localStorage.getItem("dados_favoritos") || "[]");
	}, 7000);


	//fazer com que ao carregar a página dar load nos dados
	$(".table").on('load', receberDadosAPI());

	function atualizarDadosTabela(dados)
	{
	
		$.each(dados, function(index, result){
		    //atualização dos dados na tabela atual
		    $('.market_cap_rank', $('#'+result.id)).html(result.market_cap_rank)
		    $('#logo_moeda', $('#'+result.id)).attr('src', result.image)
		    if (dados_favoritos.includes("favorito_"+result.id)){
		    	$('.name', $('#'+result.id)).html("<img class='favorito'  id='favorito_"+result.id + "' src='assets/img/estrela_favorito.png' >  " + result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    else{
		    	$('.name', $('#'+result.id)).html("<img class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_nao_favorito.png' >  " + result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    $('.current_price', $('#'+result.id)).html(result.current_price+' €')
		    $('.price_change_percentage_24h_in_currency', $('#'+result.id)).html(result.price_change_percentage_24h_in_currency.toFixed(3))
		    $('.price_change_percentage_7d_in_currency', $('#'+result.id)).html(result.price_change_percentage_7d_in_currency.toFixed(3))
		})
	}

	function recriarDadosTabela(dados)
	{
		$('.dadosMoeda').remove();
		$.each(dados, function(index, result){
			var estrutura = estrutura_dados_moeda.clone()

			estrutura.attr('id',result.id)

		    
	    	$('.market_cap_rank', estrutura).html(result.market_cap_rank)
		    $('#logo_moeda', estrutura).attr('src', result.image)
		    if (dados_favoritos.includes("favorito_"+result.id)){
		    	$('.name', estrutura).html("<img class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_favorito.png' >  " + result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    else{
		    	$('.name', estrutura).html("<img class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_nao_favorito.png' >  " + result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    $('.current_price', estrutura).html(result.current_price+' €')
		    $('.price_change_percentage_24h_in_currency', estrutura).html(result.price_change_percentage_24h_in_currency.toFixed(3))
		    $('.price_change_percentage_7d_in_currency', estrutura).html(result.price_change_percentage_7d_in_currency.toFixed(3))
		    if(pagina_atual == 'favoritos' && dados_favoritos.includes("favorito_"+result.id))
		    {
		    	$('.table').append(estrutura)
		    }
		    else if(pagina_atual == "pagina-incial"){
			    // Adicionar o clone à tabela original
			    $('.table').append(estrutura)
		    }
		    
		})
	}

	function pesquisaDadosTabela(dados,texto)
	{
		texto = texto.toUpperCase();
		var nome = "";
		$('.dadosMoeda').remove();
		$.each(dados, function(index, result){
			var estrutura = estrutura_dados_moeda.clone()

			estrutura.attr('id',result.id)
	    	$('.market_cap_rank', estrutura).html(result.market_cap_rank)
		    $('#logo_moeda', estrutura).attr('src', result.image)
		    if (dados_favoritos.includes("favorito_"+result.id)){
		    	$('.name', estrutura).html("<img id='favorito_"+result.id + "' src='assets/img/estrela_favorito.png' >  " + result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    else{
		    	$('.name', estrutura).html("<img id='favorito_"+result.id + "' src='assets/img/estrela_nao_favorito.png' >  " + result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    $('.current_price', estrutura).html(result.current_price+' €')
		    $('.price_change_percentage_24h_in_currency', estrutura).html(result.price_change_percentage_24h_in_currency.toFixed(3))
		    $('.price_change_percentage_7d_in_currency', estrutura).html(result.price_change_percentage_7d_in_currency.toFixed(3))
		    // Adicionar o clone à tabela original
		    nome = result.name.toUpperCase();
		    if (nome.includes(texto)){
		    	if(pagina_atual == 'favoritos' && dados_favoritos.includes("favorito_"+result.id))
			    {
			    	$('.table').append(estrutura);	
			    }
			    else if (pagina_atual == "pagina-incial"){
				    // Adicionar o clone à tabela original
				    $('.table').append(estrutura);
			    }
		    }
		    
		});
	}


	function receberDadosAPI(){

		//função para atualizar os dados da lista
		$.ajax({
			method: "GET",
			url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
		}).done(function(res){
			if(dados_atuais_tabela.length == 0){ recriarDadosTabela(res)};

			dados_atuais_tabela = res;
			dados_atuais_tabela = duplicarArray(res);
		})
	}

	function organizarDados(categoria){
		var ordem_atual = $("#ordem").html();
		console.log(ordem_atual);

		var dados = duplicarArray(dados_atuais_tabela);

		var dados_auxiliar = [];

		var filtro = categoria+"_";

		if(ordem_atual == "▼")
		{
			filtro +="desc";
		}
		else if (ordem_atual == "▲"){
			filtro +="asc";
		}
		console.log(filtro);
		

		if ( filtro == 'rank_asc') {
			dados_auxiliar = dados;
			$("#ordem").html("▼");
			
		}
		else if (filtro == 'rank_desc')
		{
			$("#ordem").html("▲");
			dados_auxiliar = dados;
			dados_auxiliar.reverse();


		}
		recriarDadosTabela(dados_auxiliar);
	}




	$("#barra_procura").on('focusin', function(e){

		$(this).on('keyup', function(){
			console.log($(this).val());
			pesquisaDadosTabela(dados_atuais_tabela,$(this).val())

		});
	});
	
	$("#header_rank").on('click', function (){
		organizarDados('rank');
	});


	$(".nav-link").on('click', function(e){ 

		$(".active").removeClass('active');
		$(this).addClass('active');
		var referencia = $(this).attr('href');


		if(referencia == "#favoritos"){
			$('h1').html('Moedas definidas como favoritas');
			pagina_atual = "favoritos";
			recriarDadosTabela(dados_atuais_tabela);
		}
		else if(referencia == "#pagina-inicial"){
			$('h1').html('Moedas');
			pagina_atual = "pagina-incial";
			recriarDadosTabela(dados_atuais_tabela);
		}

		$('#titulo').text("Projeto Coingecko | "+pagina_atual);

		$('#dados_moedas').hide();
		$('#dados_moedas').fadeIn(1000);
	});

	$("body").on('click','img', function(){
	    if($(this).attr('id').includes('favorito_')){
	    	if (dados_favoritos.includes($(this).attr('id'))){
	    		dados_favoritos.splice(dados_favoritos.indexOf($(this).attr('id'),1));
	    		$(this).attr('src', 'assets/img/estrela_nao_favorito.png');
	    		localStorage.setItem("dados_favoritos", JSON.stringify(dados_favoritos));
	    	}else{
	    		dados_favoritos.push($(this).attr('id'));
	    		$(this).attr('src', 'assets/img/estrela_favorito.png');
	    		localStorage.setItem("dados_favoritos", JSON.stringify(dados_favoritos));
	    	}
    	}
	});

	$("body").on('mouseout','img', function(){
	    if($(this).attr('id').includes('favorito_')){
	    	if (dados_favoritos.includes($(this).attr('id'))){
	    		$(this).attr('src', 'assets/img/estrela_favorito.png');
	    	}else{
	    		$(this).attr('src', 'assets/img/estrela_nao_favorito.png');
    		}
    	}	
	});

	$("body").on('mouseover','img', function(){
		if($(this).attr('id').includes('favorito_')){
	    	$(this).attr('src', 'assets/img/estrela_hover.png');
	    }
	});

});


function duplicarArray(arrayOriginal){
	/*criação função Auxiliar para duplicar arrays
	array_duplicada = duplicarArray(arrayOriginal)
	Esta função retorna a array duplicada e faz com que possa ser utilizada sem problemas dos endereços de memória.
	
	*/
	const duplicada = [];
	for (const i of arrayOriginal) {
	  duplicada.push(i)
	}
	return duplicada;
}





