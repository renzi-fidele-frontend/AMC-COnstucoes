$(document).ready(function () {
  verificarExibicaoBotao();

  // Evento botão carregar mais imoveis
  $("#btn-carregar-mais-empreendimentos").on("click", function () {
    $("#loading").show();

    setTimeout(function () {
      $("#infiniteContent .none").first().removeClass("none");
      $("#infiniteContent .none").first().removeClass("none");
      $("#infiniteContent .none").first().removeClass("none");
      
      $("#loading").hide();
      verificarExibicaoBotao();
    }, 900);
  });

  function verificarExibicaoBotao() {
    $("#infiniteContent .none").length > 0 ? $("#btn-carregar-mais-empreendimentos").show() : $("#btn-carregar-mais-empreendimentos").hide();
  }


  //--- resultado do filtro
  if ($("#valores-filtro").length > 0) {
    var valores = $("#valores-filtro");

    $("#EstadosFiltro").val(valores.data('idestado'));
    carregarCidadePorEstado(valores.data('idestado'), valores.data('idcidade'));
    $("#StatusFiltro").val(valores.data('status'));    
    carregarRegiaoPorCidade(valores.data('idcidade'), valores.data('idregiao'));
  }
});