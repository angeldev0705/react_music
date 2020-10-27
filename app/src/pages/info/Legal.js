import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import { Icon } from '../../components/misc/Icon';
import DocumentMeta from 'react-document-meta';

export class Legal extends PageComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired
  };

  render() {
    return (
      <div>
        <DocumentMeta {...SEO.simple('Licencia Legal de Uso')} />
        <div className="page-title primary shadow">
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />
          <h1>Licencia Legal de Uso</h1>
        </div>

        <div className="col-sm-12">
          <p className="text-justify">
            <strong>D'austin S.A.C.</strong> (Propietaria y Administrador de la
            Pagina Web www.setbeat.com) Portal de Música digital online y la
            Asociación Peruana de Autores y Compositores APDAYC han firmado un
            contrato mediante el cual{' '}
            <strong>
              APDAYC otorga licencia y derechos a D'austin S.A.C. para difundir
              y poner a disposición obras musicales tanto nacionales e
              internacionales
            </strong>
            en entornos digitales de reproducción, bajo el amparo del Decreto
            Legislativo Nº 822{' '}
            <strong>
              “Ley Peruana de los Derechos de Autores y Compositores”
            </strong>{' '}
            y en convenio de reciprocidad con sociedades análogas (
            <a rel="nofollow" href="http://www.apdayc.org.pe/contratosr.htm">
              http://www.apdayc.org.pe/contratosr.htm
            </a>
            ) de diferentes paises como:<br />
            Argentina, Australia, Alemania, Brasil, Bélgica, Bolivia, Bulgaria,
            Burkina, Faso, Canadá, Colombia, Costa Rica, Cuba, Chile, Dinamarca,
            Ecuador, España, Estados Unidos, Filipinas, Finlandia, Francia,
            Grecia, Holanda, Inglaterra, Israel, Irlanda, Italia, Japón, México,
            Paraguay, Panamá, Portugal, Polonia, Rep. Checa, Sudáfrica, Suecia,
            Suiza, Venezuela.
          </p>
          <div>
            <div>&nbsp;</div>
            <div>
              El citado contrato lleva la firma de las siguientes
              representaciones:
            </div>
          </div>
          <p className="text-justify">
            La APDAYC (Asociación Peruana De Autores Y Compositores):<br />
            Representado por su apoderado Website:{' '}
            <a rel="nofollow" href="http://www.apdayc.org.pe">
              www.apdayc.org.pe
            </a>
            <ol>
              <li>situado en Av. Petit Thouars 5038 Miraflores</li>
              <li> Tel: +51 242 3553</li>
              <li> Fax: +51 242 3248</li>
            </ol>
          </p>
          <div className="clearfix" />
          <p className="text-justify">
            Por la Asociación Peruana de Autores y Compositores Apdayc:
            <strong>
              {' '}
              Sr. Oscar Ernesto Raez Bernuy DNI 07189871 - Apoderado
            </strong>
          </p>
          <p className="text-justify">
            D'austin S.A.C. es una empresa constituida bajo el amparo del
            Decreto Ley Nº 21621; Que respeta los Derechos de Autor, las normas
            laborales y tributarias vigentes.
          </p>
        </div>
      </div>
    );
  }
}
