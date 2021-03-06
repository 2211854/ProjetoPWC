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




	//criacao do clone dos campos para os dados das moedas
	const estrutura_dados_moeda = $('.dadosMoeda').clone();

	//variavel com os dados originais da tabela
	var dados_originais_tabela = [];
	//variavel com os dados dos favoritos
	var dados_favoritos = JSON.parse(localStorage.getItem("dados_favoritos") || "[]");

	var dados_atuais_tabela = [];

	var valorizacao = "eur";

	var ranking_maximo = 100;

	var pagina_atual = 'pagina-incial';

	var detalhado = "";

$(document).ready( function(){


	
	
	
	// temporizador para receber e atualizar os dados da api a cada 15 segundos
	let temporizador = setInterval(function(){
		receberDadosAPI(valorizacao);
		dados_favoritos = JSON.parse(localStorage.getItem("dados_favoritos") || "[]");
	}, 15000);
	// temporizador para atualizar os css rapidamente
	let temporizador_zero = setInterval(function(){

		if ($("#top100").is(':checked')) {
			$("#botao100").addClass("active");

		}else{
			$("#botao100").removeClass("active");
		}

		if ($("#top10").is(':checked')) {
			$("#botao10").addClass("active");
		
		}else{
			$("#botao10").removeClass("active");
		}

		if ($("#valorEUR").is(':checked')) {
			$("#botaoEUR").addClass("active");
		}else{
			$("#botaoEUR").removeClass("active");
		}

		if ($("#valorUSD").is(':checked')) {
			$("#botaoUSD").addClass("active");
		}else{
			$("#botaoUSD").removeClass("active");
		}

	},100)

	//fazer com que ao carregar a página dar load nos dados
	$("tbody").on('load', receberDadosAPI(valorizacao));

	function atualizarDadosTabela(dados)
	{
	
		$.each(dados, function(index, result){

			var estrutura = estrutura_dados_moeda.clone();
			if (dados_atuais_tabela.length == 10 && ranking_maximo == 100 && result.market_cap_rank>10) {
				estrutura.attr('id',result.id)
				$("tbody").append(estrutura);
			}

		    //atualização dos dados na tabela atual
		    $('.market_cap_rank', $('#'+result.id)).html(result.market_cap_rank)
		    $('#logo_moeda', $('#'+result.id)).attr('src', result.image)
		    if (dados_favoritos.includes("favorito_"+result.id)){
		    	$('.name', $('#'+result.id)).html("<img class='favorito'  id='favorito_"+result.id + "' src='assets/img/estrela_favorito.png' >  <a  href='#' class='text-dark' data-toggle='modal' data-target='#detalhesMoeda' onclick='detalhes(`"+result.id+"`)' >" + result.name + "</a>  <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    else{
		    	$('.name', $('#'+result.id)).html("<img class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_nao_favorito.png' >  <a  href='#' class='text-dark' data-toggle='modal' data-target='#detalhesMoeda' onclick='detalhes(`"+result.id+"`)' >" + result.name + "</a> <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    $('.current_price', $('#'+result.id)).html(result.current_price+" "+valorizacao)
		    $('.price_change_percentage_24h_in_currency', $('#'+result.id)).html(result.price_change_percentage_24h_in_currency.toFixed(3)+" %")
		    $('.price_change_percentage_7d_in_currency', $('#'+result.id)).html(result.price_change_percentage_7d_in_currency.toFixed(3)+" %")	
		    
		    $.each(dados_atuais_tabela, function(secondary_index, secondary_result){
		    	if(result.id == secondary_result.id){
					dados_atuais_tabela[secondary_index] = result;
				}
			})



		})
		
	}


	function recriarDadosTabela(dados)
	{
		$('.dadosMoeda').remove();

		var fav_count = 0;
		$.each(dados, function(index, result){
			var estrutura = estrutura_dados_moeda.clone()

			estrutura.attr('id',result.id)

		    
	    	$('.market_cap_rank', estrutura).html(result.market_cap_rank)
		    $('#logo_moeda', estrutura).attr('src', result.image)
		    if (dados_favoritos.includes("favorito_"+result.id)){
		    	$('.name', estrutura).html("<img class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_favorito.png' >  <a  href='#' class='text-dark' data-toggle='modal' data-target='#detalhesMoeda' onclick='detalhes(`"+result.id+"`)' >" + result.name + "</a> <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    else{
		    	$('.name', estrutura).html("<img class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_nao_favorito.png' >  <a  href='#' class='text-dark' data-toggle='modal' data-target='#detalhesMoeda' onclick='detalhes(`"+result.id+"`)' >" + result.name + "</a> <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    $('.current_price', estrutura).html(result.current_price+" "+valorizacao)
		    $('.price_change_percentage_24h_in_currency', estrutura).html(result.price_change_percentage_24h_in_currency.toFixed(3)+" %")
		    $('.price_change_percentage_7d_in_currency', estrutura).html(result.price_change_percentage_7d_in_currency.toFixed(3)+" %")
		    if(pagina_atual == 'favoritos' && dados_favoritos.includes("favorito_"+result.id))
		    {
		    	fav_count++;
		    	if ((ranking_maximo == 10 && index <10) || ranking_maximo == 100 || fav_count<=10 ) {
		    		$('tbody').append(estrutura);
		    	}
		    	else{
		    		return false;
		    	}
		    }
		    else if(pagina_atual == "pagina-incial"){
			    // Adicionar o clone à tabela original
		    	if ((ranking_maximo == 10 && index <10) || ranking_maximo == 100) {
		    		$('tbody').append(estrutura);
		    	}
		    	else{
		    		return false;
		    	}
		    }
		    
		})
	}


	function receberDadosAPI(currency){

		//função para atualizar os dados da lista
		$.ajax({
			method: "GET",
			url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+currency+"&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
		}).done(function(res){

			if(dados_originais_tabela.length == 0){ 
				recriarDadosTabela(res);
				dados_atuais_tabela = res;

			};
			dados_originais_tabela = duplicarArray(res);
			atualizarDadosTabela(dados_originais_tabela);
			detalhes(detalhado);
		})
	}

	function organizarDados(categoria){
		var ordem_atual = $("#ordem").text();
		var dados = duplicarArray(dados_atuais_tabela);
		var dados_auxiliar = duplicarArray(dados_atuais_tabela);

		//definir a ordem
		if(ordem_atual == "▲")
		{
			ordem_atual ="desc";
			$("#ordem").text("▼");

		}
		else if (ordem_atual == "▼"){
			ordem_atual ="asc";
			$("#ordem").text("▲");
		}

		switch(categoria) {
		//organizar por market_cap
		  case 'rank':
		  	var lista_ranks = [];

		  	for (const i of dados) {
			  lista_ranks.push(i.market_cap_rank);
			}

		   	lista_ranks.sort(function(a, b){return a-b});

		   	for (i = 0; i < dados.length; i++) {
		   		dados_auxiliar[lista_ranks.indexOf(dados[i].market_cap_rank,0)] = dados[i];
		   	}

		  break;
		  //organizar por nome
		  case 'nome':
		  	var lista_nomes = [];

		  	for (const i of dados) {
			  lista_nomes.push(i.name.toUpperCase());
			}

		   	lista_nomes.sort();

		   	for (i = 0; i < dados.length; i++) {
		   		dados_auxiliar[lista_nomes.indexOf(dados[i].name.toUpperCase(),0)] = dados[i];
		   	}

		   	break;
		   //organizar por preço
		  case 'preco':
		  	var lista_precos = [];

		  	for (const i of dados) {
			  lista_precos.push(i.current_price);
			}

		   	lista_precos.sort(function(a, b){return a-b});

		   	for (i = 0; i < dados.length; i++) {
		   		dados_auxiliar[lista_precos.indexOf(dados[i].current_price,0)] = dados[i];
		   	}

		   	break;
		  //organizar por mudanças nas ultimas 24h
		  case '24h':

		  	var lista_24h = [];

		  	for (const i of dados) {
			  lista_24h.push(i.price_change_percentage_24h_in_currency);
			}

		   	lista_24h.sort(function(a, b){return a-b});

		   	for (i = 0; i < dados.length; i++) {
		   		dados_auxiliar[lista_24h.indexOf(dados[i].price_change_percentage_24h_in_currency,0)] = dados[i];
		   	}

		   	break;
		  //organizar por mudanças nos ultimos 7d
		  case '7d':
		  	var lista_7d = [];

		  	for (const i of dados) {
			  lista_7d.push(i.price_change_percentage_7d_in_currency);
			}

		   	lista_7d.sort(function(a, b){return a-b});

		   	for (i = 0; i < dados.length; i++) {
		   		dados_auxiliar[lista_7d.indexOf(dados[i].price_change_percentage_7d_in_currency,0)] = dados[i];
		   	}
		   	break;

		}

		if (ordem_atual == 'desc'){
			dados_auxiliar.reverse();
		}


		dados_atuais_tabela = duplicarArray(dados_auxiliar);
		recriarDadosTabela(dados_auxiliar);
	}


	  $("#barra_procura").on("keyup", function() {
	    var value = $(this).val().toLowerCase();
	    $(".dadosMoeda").filter(function() {
	      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
	  });
/*
	estas funçoes fizemos manualmente para fazer a procura mas depois descobrimos a existencia do prototype.filter() e decidimos fazer com esse pois é mais simmples 
	



	$("#barra_procura").on('focusin', function(e){

		$(this).on('keyup', function(){
			pesquisaDadosTabela(dados_atuais_tabela,$(this).val())

		});
	});

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
		    	$('.name', estrutura).html("<img  class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_favorito.png' >  <a  href='#' class='text-dark' data-toggle='modal' data-target='#detalhesMoeda' onclick='detalhes(`"+result.id+"`)' >" + result.name + "</a> <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    else{
		    	$('.name', estrutura).html("<img  class='favorito' id='favorito_"+result.id + "' src='assets/img/estrela_nao_favorito.png' >  <a  href='#' class='text-dark' data-toggle='modal' data-target='#detalhesMoeda' onclick='detalhes(`"+result.id+"`)' >" + result.name + "</a> <span class='text-muted'>" + result.symbol+"</span>")
		    }
		    $('.current_price', estrutura).html(result.current_price+' €')
		    $('.price_change_percentage_24h_in_currency', estrutura).html(result.price_change_percentage_24h_in_currency.toFixed(3)+" %")
		    $('.price_change_percentage_7d_in_currency', estrutura).html(result.price_change_percentage_7d_in_currency.toFixed(3)+" %")
		    // Adicionar o clone à tabela original
		    nome = result.name.toUpperCase();
		    if (nome.includes(texto)){
		    	if(pagina_atual == 'favoritos' && dados_favoritos.includes("favorito_"+result.id))
			    {
			    	$('tbody').append(estrutura);	
			    }
			    else if (pagina_atual == "pagina-incial"){
				    // Adicionar o clone à tabela original
				    $('tbody').append(estrutura);
			    }
		    }
		    
		});
	}
*/
	//acionar a ordem por rank
	$("#header_rank").on('click', function (){
		var texto = $(this).text();
		if(texto.indexOf("▲") == -1 && texto.indexOf("▼") == -1){
			const ordem = $("#ordem").clone();
			$("#ordem").remove();
			ordem.html("▲");
			$("#header_rank a").append(ordem);
		}
		organizarDados('rank');
	});
	
	//acionar a ordem por nome
	$("#header_nome").on('click', function (){
		var texto = $(this).text();
		if(texto.indexOf("▼") == -1 && texto.indexOf("▲") == -1){
			const ordem = $("#ordem").clone();
			$("#ordem").remove();
			ordem.html("▲");
			$("#header_nome a").append(ordem);
		}
		organizarDados('nome');
	});

	//acionar a ordem por preço
	$("#header_preco a").on('click', function (){
		var texto = $(this).text();
		if(texto.indexOf("▼") == -1 && texto.indexOf("▲") == -1){
			const ordem = $("#ordem").clone();
			$("#ordem").remove();
			ordem.html("▲");
			$("#header_preco a").append(ordem);
		}
		organizarDados('preco');
	});

	//acionar a ordem por mudança 24h
	$("#header_24h").on('click', function (){
		var texto = $(this).text();
		if(texto.indexOf("▼") == -1 && texto.indexOf("▲") == -1){
			const ordem = $("#ordem").clone();
			$("#ordem").remove();
			ordem.html("▲");
			$("#header_24h a").append(ordem);
		}
		organizarDados('24h');
	});		

	//acionar a ordem por mudança 7d
	$("#header_7d").on('click', function (){
		var texto = $(this).text();
		if(texto.indexOf("▼") == -1 && texto.indexOf("▲") == -1){

			const ordem = $("#ordem").clone();
			$("#ordem").remove();
			ordem.html("▲");
			$("#header_7d a").append(ordem);
		}
		organizarDados('7d');
	});


	//serve para alterar entre o separador dos favoritos e a pagina inicial
	$(".nav-link").on('click', function(e){ 

		$(".active").removeClass('active');
		$(this).addClass('active');
		var referencia = $(this).attr('href');


		if(referencia == "#favoritos"){
			$("#tituloPrincipal").html('Moedas Favoritas');
			pagina_atual = "favoritos";
			recriarDadosTabela(dados_atuais_tabela);
		}
		else if(referencia == "#pagina-inicial"){
			$('#tituloPrincipal').html('Moedas');
			pagina_atual = "pagina-incial";
			recriarDadosTabela(dados_atuais_tabela);
		}

		$('#tituloSeparador').text("Projeto Coingecko | "+pagina_atual);

		$('#dados_moedas').fadeOut(200);
		$('#dados_moedas').fadeIn(500);
	});

	/* responsavel por gravar o os favoritos */ 
	$("body").on('click','img', function(){
	    if($(this).attr('id').includes('favorito_')){
	    	var coin = $(this).attr('id').substring(9,$(this).attr('id').length);

	    	if (coin == "detalhes") {
	    		coin = detalhado;

	    		$("#favorito_"+coin).attr('src', 'assets/img/estrela_favorito.png');

	    		$("#favorito_"+coin).attr('src', 'assets/img/estrela_nao_favorito.png');
	    	}
	    	if (dados_favoritos.includes("favorito_"+coin)){

	    		if(dados_favoritos.indexOf("favorito_"+coin)== 0){
	    			dados_favoritos.shift();
	    		}else{
	    			dados_favoritos.splice(dados_favoritos.indexOf("favorito_"+coin),dados_favoritos.indexOf("favorito_"+coin));
	    		}
	    		$("#favorito_"+coin).attr('src', 'assets/img/estrela_nao_favorito.png');
	    		localStorage.setItem("dados_favoritos", JSON.stringify(dados_favoritos));
	    	}else{
	    		dados_favoritos.push("favorito_"+coin);
	    		$("#favorito_"+coin).attr('src', 'assets/img/estrela_favorito.png');
	    		localStorage.setItem("dados_favoritos", JSON.stringify(dados_favoritos));
	    	}

    	}
	});


	/* responsavel para quando o mouse é colocado em cima da estrela do favorito mude a imagem */ 
	$("body").on('mouseout','img', function(){
	    if($(this).attr('id').includes('favorito_')){

	    	var coin = $(this).attr('id').substring(9,$(this).attr('id').length);

	    	if (coin == "detalhes") {
	    		coin = detalhado;
	    	}
	    	if (dados_favoritos.includes("favorito_"+coin)){
	    		$(this).attr('src', 'assets/img/estrela_favorito.png');
	    	}else{
	    		$(this).attr('src', 'assets/img/estrela_nao_favorito.png');
    		}
    	}	
	});

	/* responsavel para quando o mouse é colocado em cima da estrela do favorito mude a imagem */ 
	$("body").on('mouseover','img', function(){
		if($(this).attr('id').includes('favorito_')){
	    	$(this).attr('src', 'assets/img/estrela_hover.png');
	    }
	});
	/* botões dos filtros que permitem mudar a varlorização das moedas (eur ou usd) */ 
	$("#valorEUR").on('change',function(){
		valorizacao="eur";
		receberDadosAPI("eur");
	} )
	$("#valorUSD").on('change',function(){
		valorizacao="usd";
		receberDadosAPI("usd");
	} )

	/* botões dos filtros que permitem mudar a quantidade de valores que pretendem quer apareça */ 
	$("#top100").on('change',function(){

		ranking_maximo = 100;
		recriarDadosTabela(dados_atuais_tabela);


	} )

	$("#top10").on('change', function(){
		ranking_maximo = 10;
		recriarDadosTabela(dados_atuais_tabela);
	})




	
});



// função responsável atualizar a página dos detalhes com os detalhes da moeda pretendida
function detalhes(moeda){
	detalhado = moeda;

	$.each(dados_originais_tabela, function(index, result){

		if (moeda == result.id) {

			$(".detalhes_name").html(result.name);
			$(".favorito_detalhes").attr('detalhado',"favorito_"+result.id);
    		$(".favorito_detalhes").attr('id',"favorito_detalhes");
		    
		    if (dados_favoritos.includes("favorito_"+result.id)){
	    		$("#favorito_detalhes").attr('src', 'assets/img/estrela_favorito.png');
	    		$("#favorito_"+moeda).attr('src', 'assets/img/estrela_favorito.png');
	    	}else{
	    		$("#favorito_detalhes").attr('src', 'assets/img/estrela_nao_favorito.png');
	    		$("#favorito_"+moeda).attr('src', 'assets/img/estrela_nao_favorito.png');

    		}			

			$(".detalhes_image").attr('src',result.image);
			$(".detalhes_symbol").html(result.symbol);
			$(".detalhes_price").html(result.current_price+" "+valorizacao);
			$(".detalhes_24h").html(result.price_change_percentage_24h_in_currency.toFixed(3)+" %");
			$(".detalhes_7d").html(result.price_change_percentage_7d_in_currency.toFixed(3)+" %");
			if(result.market_cap == null){result.market_cap = "∞"};

			$(".detalhes_marketcap").html(result.market_cap +" "+valorizacao);
			if(result.circulating_supply == null){result.circulating_supply = "∞"}
			$(".detalhes_circulating_supply").html(result.circulating_supply+" "+valorizacao);
			if(result.fully_diluted_valuation == null){result.fully_diluted_valuation = "∞"};
			$(".detalhes_full_diluted").html(result.fully_diluted_valuation+" "+valorizacao);
			$(".detalhes_total_supply").html(result.total_supply+" "+valorizacao);
			$(".detalhes_high_24h").html(result.high_24h+" "+valorizacao);
			$(".detalhes_total_max_supply").html(result.max_supply+" "+valorizacao);

			return false;
		}
	})

	
}