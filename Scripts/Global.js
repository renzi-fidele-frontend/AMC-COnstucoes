function exibirMensagem(tipoMensagem, mensagem) {
   if (tipoMensagem == "S") toastr["success"](mensagem);
   else if (tipoMensagem == "E") toastr["error"](mensagem);
   else if (tipoMensagem == "I") toastr["info"](mensagem);
   else if (tipoMensagem == "A") toastr["warning"](mensagem);
}

//Dropdowns do FIltro//
function dropdownEstadoFiltro() {
   var idEstado = $("#EstadosFiltro").val();

   $.post("/Layout/BuscarCidadesExisteEmpreendimento", { idEstado: idEstado }, function (data) {
      var v = "<option>Cidade</option>";

      $.each(data, function (i, v1) {
         v += "<option value=" + "'" + v1.Value + "'" + ">" + v1.Text + "</option>";
      });

      $("#CidadesFiltro").html(v);
   });
}

function dropdownCidadeFiltro() {
   var idCidade = $("#CidadesFiltro").val();

   $.post("/Layout/BuscarRegioes", { idCidade: idCidade }, function (data) {
      var v = "<option>Regi&atilde;o</option>";

      $.each(data, function (i, v1) {
         v += "<option value=" + "'" + v1.Value + "'" + ">" + v1.Text + "</option>";
      });

      $("#RegiaoFiltro").html(v);
   });
}

//DropDowns Gen�ricas //
function dropdownEstado(idEstado, controller) {
   $.post("/" + controller + "/BuscarCidades", { idEstado: idEstado }, function (data) {
      var v = "<option>Selecione a cidade</option>";

      $.each(data, function (i, v1) {
         v += "<option value=" + "'" + v1.Value + "'" + ">" + v1.Text + "</option>";
      });

      $("#Cidade").html(v);
   });
}

function dropdownCidade(idCidade, controller) {
   $.post("/" + controller + "/BuscarRegioes", { idCidade: idCidade }, function (data) {
      var v = "<option>Regi�es</option>";

      $.each(data, function (i, v1) {
         v += "<option value=" + "'" + v1.Value + "'" + ">" + v1.Text + "</option>";
      });

      $("#Regiao").html(v);
   });
}

function mandarEmail() {
   let loadRef = document.querySelector("#loadImg");
   loadRef.setAttribute("style", "display: initial");
   let msg = document.querySelector("#Mensagem").value;
   let cidade = document.querySelector("#inputCidade").value;
   let estado = document.querySelector("#inputEstado").value;
   let tel = document.querySelector("#Telefone").value;
   let email = document.querySelector("#Email").value;
   let nome = document.querySelector("#Nome").value;
   let templateParams = {
      nome: nome,
      email: email,
      tel: tel,
      estado: estado,
      cidade: cidade,
      mensagem: msg,
   };
   let allInputs = document.querySelectorAll("input");

   emailjs.send("service_nnitgsk", "template_mfp7uim", templateParams).then(function (e) {
      loadRef.setAttribute("style", "display: none");
      alert("Email enviado");
      allInputs.forEach((singleInput) => (singleInput.value = ""));
      msg.value = "";
   });
}

function carregarCidadePorEstado(idEstado, idCidade) {
   $.post("/Layout/BuscarCidadesExisteEmpreendimento", { idEstado: idEstado }, function (data) {
      var v = "<option>Cidade</option>";

      $.each(data, function (i, v1) {
         v += "<option " + (v1.Value == idCidade ? "selected" : "") + " value=" + "'" + v1.Value + "'" + ">" + v1.Text + "</option>";
      });

      $("#CidadesFiltro").html(v);
   });
}

function carregarRegiaoPorCidade(idCidade, idRegiao) {
   $.post("/Layout/BuscarRegioes", { idCidade: idCidade }, function (data) {
      var v = "<option>Regioes</option>";

      $.each(data, function (i, v1) {
         v += "<option " + (v1.Value == idRegiao ? "selected" : "") + " value=" + "'" + v1.Value + "'" + ">" + v1.Text + "</option>";
      });

      $("#RegiaoFiltro").html(v);
   });
}
