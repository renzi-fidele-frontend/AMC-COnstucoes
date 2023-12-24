'use strict';

function ClassGoogleMaps() {

  // Atributos
  this._Mapa;
  this._Latitude;
  this._Longitude;
  this._Zoom;

  // Metodos
  this.InicializarMapa;

  this.SetarOptions;
  this.SetarCoordenadas;
  this.SetarEndereco;
  this.SetarZoom;
  this.SetarTipoMapa;
  this.SetarMarcador;
  this.SetarMarcadorLocalPerto;
  this.SetarMarcadorLocalPertoRealizaConstrutora;

  this.ObterCoordenadasPorEndereco;

  this.HabilitarInputAutocomplete;

  this.CalcularRotaPorNomeEndereco;
}

// Instanciando a classe
var ClasseGoogleMaps = new ClassGoogleMaps();

/* ------------------------------ METODOS -------------------------- */

ClassGoogleMaps.prototype.InicializarMapa = function (idMapa) {
  /// <summary>Inicializando o mapa sem configurações</summary>
  /// <param name='idMapa' type='string'>ID da div onde esta o mapa</param>

  ClasseGoogleMaps._Mapa = new google.maps.Map(document.getElementById(idMapa));
}

ClassGoogleMaps.prototype.SetarOptions = function (options) {
  /// <summary>Seta as configurações de options do google maps</summary>
  /// <param name='options' type='objeto json'>{ scrollwheel: false, zoom: 15, center : new google.maps.LatLng(..... }</param>

  ClasseGoogleMaps._Mapa.setOptions(options);
}

ClassGoogleMaps.prototype.SetarCoordenadas = function (latitude, longitude) {
  /// <summary>Seta as coordenadas</summary>
  /// <param name='latitude' type='decimal'>-34.397</param>
  /// <param name='longitude' type='decimal'>150.644)</param>

  ClasseGoogleMaps._Mapa.setCenter(new google.maps.LatLng(latitude, longitude));
}

ClassGoogleMaps.prototype.SetarEndereco = function (endereco) {
  /// <summary>Faz a busca pelo nome do endereço</summary>
  /// <param name='endereco' type='string'>Rua, número, bairro, cidade - estado, cep, país</param>

  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': endereco }, function (results, status) {
    if (status == 'OK') {
      ClasseGoogleMaps.SetarCoordenadas(results[0].geometry.location.lat(), results[0].geometry.location.lng())
    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  });
}

ClassGoogleMaps.prototype.SetarZoom = function (zoom) {
  /// <summary>Seta o zoom</summary>
  /// <param name='zoom' type='int'>valores entre 0 e 22</param>

  ClasseGoogleMaps._Mapa.setZoom(zoom);
}

ClassGoogleMaps.prototype.SetarTipoMapa = function (tipoMapa) {
  /// <summary>Seta o tipo de mapa</summary>
  /// <param name='tipoMapa' type='int'>1 = HYBRID
  ///                                   2 = ROADMAP
  ///                                   3 = SATELLITE
  ///                                   4 = TERRAIN
  /// </param >

  switch (tipoMapa) {
    case 1:
      ClasseGoogleMaps._Mapa.setMapTypeId(google.maps.MapTypeId.HYBRID);
      break;
    case 2:
      ClasseGoogleMaps._Mapa.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      break;
    case 3:
      ClasseGoogleMaps._Mapa.setMapTypeId(google.maps.MapTypeId.SATELLITE);
      break;
    case 4:
      ClasseGoogleMaps._Mapa.setMapTypeId(google.maps.MapTypeId.TERRAIN);
      break;
    default:
      break;
  }
}

ClassGoogleMaps.prototype.SetarMarcador = function (latitude, longitude, titulo, arrastavel, conteudoJanelaInformacoes, eventoJanelaInformacoes) {
  /// <summary>Seta o marcador (pin) no mampa</summary>
  /// <param name='latitude' type='decimal'>-34.397</param>
  /// <param name='longitude' type='decimal'>150.644</param>
  /// <param name='titulo' type='string'>Nome que aparece quando o mouse estaciona sobre o marcador</param>
  /// <param name='arrastavel' type='boolean'>true: arrastavel</param>
  /// <param name='JanelaInformacoes' type='string'>Counteudo (poderá conter HTML) que aparece sobre o marcador de acordo com o evento do mouse (click, mouseover, ...etc)</param>
  /// <param name='eventoJanelaInformacoes' type='string'>'click', 'mouseover', 'mouseout' etc...</param>

  var marcador = new google.maps.Marker({
    position: new google.maps.LatLng(latitude, longitude),
    map: ClasseGoogleMaps._Mapa,
    title: titulo,
    draggable: arrastavel,
    animation: google.maps.Animation.DROP
  });

  if (conteudoJanelaInformacoes != null && conteudoJanelaInformacoes != '') {
    var infowindow = new google.maps.InfoWindow({
      content: conteudoJanelaInformacoes
    });

    marcador.addListener(eventoJanelaInformacoes, function () {
      infowindow.open(ClasseGoogleMaps._Mapa, marcador);
    });
  }
}

ClassGoogleMaps.prototype.SetarMarcadorLocalPerto = function (latitude, longitude, localPerto, caminhoImagemMarcador) {
  /// <summary>Insere no mapa o marcador de apenas 1 tipo de lugar em um raio definido</summary>
  /// <param name='latitude' type='decimal'>-34.397</param>
  /// <param name='longitude' type='decimal'>150.644</param>
  /// <param name='localPerto' type='string'>Verificar na API do GoogleMaps os tipos, ex.: 'school', 'store', 'hospital'</param>
  /// <param name='caminhoImagemMarcador' type='string'>/content/imgs/meu-marcador.png</param>

  var coordenadas = { lat: latitude, lng: longitude };

  var service = new google.maps.places.PlacesService(ClasseGoogleMaps._Mapa);
  service.nearbySearch({
    location: coordenadas,
    radius: 500,
    type: [localPerto],
  }, processResults);

  function processResults(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    } else {
      createMarkers(results);
    }
  };

  function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
      var imagemMarcador;

      if (caminhoImagemMarcador == null) {
        imagemMarcador = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
      } else {
        imagemMarcador = caminhoImagemMarcador;
      }

      var marker = new google.maps.Marker({
        map: ClasseGoogleMaps._Mapa,
        icon: imagemMarcador,
        title: place.name,
        position: place.geometry.location
      });

      bounds.extend(place.geometry.location);
    }

    ClasseGoogleMaps._Mapa.fitBounds(bounds);

    // Mantem o valor do zoom setado
    google.maps.event.addListenerOnce(ClasseGoogleMaps._Mapa, 'bounds_changed', function (event) {
      this.setZoom(15);
    });
  };
}

ClassGoogleMaps.prototype.SetarMarcadorLocalPertoRealizaConstrutora = function (latitude, longitude, localPerto) {
  /// <summary>Insere no mapa os principais lugares de referencia que estão em um raio definido</summary>
  /// <param name='latitude' type='decimal'>-34.397</param>
  /// <param name='longitude' type='decimal'>150.644</param>
  /// <param name='localPerto' type='string'>'school'</param>

  var coordenadas = { lat: latitude, lng: longitude };

  var service = new google.maps.places.PlacesService(ClasseGoogleMaps._Mapa);
  service.nearbySearch({
    location: coordenadas,
    radius: 1000,
    type: [localPerto],
  }, processResults);

  function processResults(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    } else {
      createMarkers(results);
    }
  }

  function createMarkers(places) {
    var caminhoArquivo = absolutePath + "build/imgs/detalhesImovel/mapa/banco-{0}.png";
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      var marker = new google.maps.Marker({
        map: ClasseGoogleMaps._Mapa,
        icon: absolutePath + "build/imgs/detalhesImovel/mapa/banco-construcao.png",
        //icon: image,
        title: place.name,
        position: place.geometry.location
      });

      bounds.extend(place.geometry.location);
    }

    ClasseGoogleMaps._Mapa.fitBounds(bounds);

    // Mantem o valor do zoom setado
    google.maps.event.addListenerOnce(ClasseGoogleMaps._Mapa, 'bounds_changed', function (event) {
      this.setZoom(15);
    });
  }
}

ClassGoogleMaps.prototype.ObterCoordenadasPorEndereco = function (endereco, callBackCoordenadas) {
  /// <summary>Faz a busca pelo nome do endereço e retorna por callback as coordenadas</summary>
  /// <param name='endereco' type='string'>Rua, número, bairro, cidade - estado, cep, país</param>
  /// <param name='callBackcallBackCoordenadas' type='function'>function(latitude, longitude){....}</param>

  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': endereco }, function (results, status) {
    if (status == 'OK') {
      if (callBackCoordenadas && typeof callBackCoordenadas == "function") {
        callBackCoordenadas(results[0].geometry.location.lat(), results[0].geometry.location.lng());
      }
    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  });
}

ClassGoogleMaps.prototype.HabilitarInputAutocomplete = function (idCampoBusca, callBackCoordenadas) {
  /// <summary>Permte que o input realize a busca de endereço com autocomplete</summary>
  /// <param name='idCampoBusca' type='string'>ID do campo texto onde sereá digitado o endereço</param>

  // Preparando o autocomplete do campo texto
  var autocomplete = new google.maps.places.Autocomplete(
    document.getElementById(idCampoBusca),
    { types: ['geocode'] }
  );


  if (callBackCoordenadas != null) {
    // Retorno do google maps com endereço, quando houver o evento 'on change'
    autocomplete.addListener('place_changed', function () {
      var endereco = autocomplete.getPlace();
      var latitude = endereco.geometry.location.lat();
      var longitude = endereco.geometry.location.lng();

      callBackCoordenadas(endereco, latitude, longitude);
    });
  }
}

ClassGoogleMaps.prototype.CalcularRotaPorNomeEndereco = function (enderecoOrigem, enderecoDestino) {
  /// <summary>Permte que o input realize a busca de endereço com autocomplete</summary>
  /// <param name='enderecoOrigem' type='string'>Ex.: Avenida Amazonas, 50, Belo Horizonte, MG</param>
  /// <param name='enderecoDestino' type='string'>Ex.: Rua Alagoas, 1660, Belo Horizonte, MG</param>

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  directionsDisplay.setMap(ClasseGoogleMaps._Mapa);

  directionsService.route({
    origin: enderecoOrigem,
    destination: enderecoDestino,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      console.log('Erro ao calcular rota: ' + status);
    }
  });
}
