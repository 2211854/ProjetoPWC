$(document).ready( function(){

	//criacao do clone dos campos para os dados das moedas
	var estrutura_dados_moeda = $('.dadosMoeda').clone();
	//variavel dos dados atuais da 
	var dados_atuais_tabela = [];

	var pagina_atual = 'pagina-incial';
	
	
	
	// temporizador para receber e atualizar os dados da api a cada minuto
	let temporizador = setInterval(function(){
		receberDadosAPI();
		atualizarDadosTabela(dados_atuais_tabela);
	}, 7000);


	//fazer com que ao carregar a página dar load nos dados
	$(".table").on('load', receberDadosAPI());

	function atualizarDadosTabela(dados)
	{
	
		$.each(dados, function(index, result){
		    //atualização dos dados na tabela atual
		    $('.market_cap_rank', $('#'+result.id)).html(result.market_cap_rank)
		    $('#logo_moeda', $('#'+result.id)).attr('src', result.image)
		    $('.name', $('#'+result.id)).html(result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
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
		    // Alterar no clone
		    if(pagina_atual == 'favoritos')
		    {
		    	//faz algo	
		    }
		    $('.market_cap_rank', estrutura).html(result.market_cap_rank)
		    $('#logo_moeda', estrutura).attr('src', result.image)
		    $('.name', estrutura).html(result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    $('.current_price', estrutura).html(result.current_price+' €')
		    $('.price_change_percentage_24h_in_currency', estrutura).html(result.price_change_percentage_24h_in_currency.toFixed(3))
		    $('.price_change_percentage_7d_in_currency', estrutura).html(result.price_change_percentage_7d_in_currency.toFixed(3))
		    // Adicionar o clone à tabela original
		    $('.table').append(estrutura)
		})
	}


	function receberDadosAPI(){

		//função para atualizar os dados da lista
		$.ajax({
			method: "GET",
			url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
		}).done(function(res){
			if(dados_atuais_tabela.length == 0){ recriarDadosTabela(res)};
<<<<<<< Updated upstream
			dados_atuais_tabela = res;
=======
			dados_atuais_tabela = duplicarArray(res);

>>>>>>> Stashed changes
		})
	}

	function organizarDados(categoria){

		var ordem_atual = $("#ordem").html();
		console.log(ordem_atual);
<<<<<<< Updated upstream
=======

		var dados = duplicarArray(dados_atuais_tabela);

>>>>>>> Stashed changes
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
			dados_auxiliar = dados_atuais_tabela;
			$("#ordem").html("▼");
			
		}
		else if (filtro == 'rank_desc')
		{
			$("#ordem").html("▲");
			dados_auxiliar = dados_atuais_tabela;
			dados_auxiliar.reverse();


		}
		recriarDadosTabela(dados_auxiliar);
	}




	$("#barra_procura").on('focusin', function(e){

		$(this).on('keyup', function(){
			/*for (var i = Things.length - 1; i >= 0; i--) {
				Things[i]
			}*/
			console.log($(this).val());

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


});


function duplicarArray(arrayOriginal){
	const duplicada = [];
	for (const i of arrayOriginal) {
	  duplicada.push(i)
	}
	return duplicada;
}