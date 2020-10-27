import React from 'react';
import { PageComponent } from '../base/Component';
import { SEO } from '../util/SEO';
import { Icon } from '../components/misc/Icon';
import { CategoryPlaylistList } from '../components/category/CategoryPlaylistList';
import { Analytics } from '../util/Analytics';
import DocumentMeta from 'react-document-meta';
import { Request } from '../util/Request';
import { SEOCategory } from '../components/misc/SEO';
import { RouteGenerator } from '../util/RouteGenerator';

export class Category extends PageComponent {
  state = {
    category: {}
  };

  componentDidMount() {
    this.scrollTop();
    Request.get(`category/slug/${this.props.params.category}`)
      .then(data => {
        this.setState({ category: data || {} }, () => {
          Analytics.pageview();
        });
      })
      .catch(err => {
        let category = this.props.params.category || '';
        this.context.router.replace({
          pathname: RouteGenerator.search(category.replace(/-/g, ' ')),
          query: this.props.params
        });
      });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;
    let category = nextState.category || {};
    if (category.id !== this.state.category.id) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    }
    return update;
  }

  render() {
    return (
      <div>
        {this.state.category &&
          this.state.category.id && (
            <DocumentMeta {...SEO.category(this.state.category)} />
          )}

        <div className="page-title primary shadow">
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />

          {this.context.isMobile && <h1>{this.state.category.name}</h1>}
          {!this.context.isMobile && (
            <h1>Escucha {this.state.category.name}</h1>
          )}
        </div>

        {!this.state.isLoading &&
          this.state.category && <SEOCategory category={this.state.category} />}

        {this.state.category.id && (
          <CategoryPlaylistList categoryId={this.state.category.id} />
        )}
      </div>
    );
  }
}
