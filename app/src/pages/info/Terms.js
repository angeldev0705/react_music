import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import { Icon } from '../../components/misc/Icon';
import DocumentMeta from 'react-document-meta';

export class Terms extends PageComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired
  };

  render() {
    return (
      <div>
        <DocumentMeta {...SEO.simple('Terminos de uso y de servicio')} />
        <div className="page-title primary shadow">
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />
          <h1>Términos de uso y de servicio</h1>
        </div>

        <div className="col-sm-12">
          <div>
            <div>
              <p className=" text-justify">
                Agradeceremos que lea estos términos y condiciones de uso
                cuidadosamente, ya que aplican a su acceso y/o uso de esta
                Página Web. Al ingresar a esta Página Web, Ud., reconoce su
                acuerdo con la misma y su entendimiento de estos Términos de
                Uso. Si Ud., no está de acuerdo con estos Términos de Uso, por
                favor no ingrese o use esta Página Web.
              </p>
            </div>
            <div>
              <div>
                <strong>1.- Restricciones de Acceso.</strong>
              </div>
              <p className="text-justify">
                El contenido de la página web www.setbeat.com tiene derechos
                legales adquiridos para difundir música de todo género, carácter
                y/o nacionalidad, derecho adquirido al amparo del Decreto
                Legislativo 822 “Ley Peruana de los Derechos de Autores y
                Compositores” en Convenio con Sociedades Análogas Extranjeras.
              </p>
              <p className="text-justify">
                El contenido de esta Web, no deben ser usados en ningún país o
                jurisdicción o por ninguna persona en donde este uso
                constituiría una violación de la Ley. Si ese es su caso Ud. No
                esta autorizado a ingresar o usar esta página web.
              </p>
              <div>
                <strong>2.- Contrato de uso.</strong>
              </div>
              <p className="text-justify">
                Al visitar esta página web y/o registrarse dentro de la misma
                Usted reconoce tener conocimiento, haber leído y estar de
                acuerdo con todos los términos y condiciones de uso de la pagina
                en mención, así como dar por aceptado nuestra política de
                privacidad y términos de uso.
              </p>
              <div>
                <strong>3.- Advertencia General.</strong>
              </div>
              <p className="text-justify">
                Cualquier intento que haga alguna persona por dañar esta Página
                Web o por minar su funcionamiento puede ser una violación de las
                leyes civiles o penales. La empresa “D'austin S.A.C” administra
                esta Pagina Web por lo que La Empresa se reserva el Derecho de
                indagar los daños que haya realizado dicha persona con todo el
                alcance de la Ley. Todo el contenido y diseño de la Pagina Web
                es propiedad intelectual de www.setbeat.com por lo que queda
                parcial y totalmente prohibida la reproducción de los diseños y
                formatos de la Pagina Web sin el expreso consentimiento de
                D'austin S.A.C.
              </p>
              <div>
                <strong>4.- Uso del Sitio y Servicios.</strong>
              </div>
              <p className="text-justify">
                Ud como usuario tiene la facultad de crear un nombre de usuario
                y contraseña, sin embargo www.setbeat.com se reserva el derecho
                de inhabilitar o eliminar un nombre de usuario a exclusiva
                discreción.
              </p>
              <p className="text-justify">
                Ud. Es responsable por la actividad que se produce bajo su
                cuenta de usuario, ya que es su responsabilidad mantener la
                confidencialidad de su contraseña, ninguna otra persona puede
                usar su cuenta sin su autorización.
              </p>
              <div>
                <strong>5.- Modificaciones.</strong>
              </div>
              <p className="text-justify">
                D'austin S.A.C se reserva el derecho de modificar, enmendar o
                complementar este acuerdo en el transcurso del tiempo y sin
                previo aviso.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
