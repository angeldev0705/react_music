import React from 'react';
import { Component } from '../../base/Component';

export class Icon extends Component {
  static codes = {
    more_vert: '\uE5D4',
    skip_previous: '\uE045',
    play_arrow: '\uE037',
    pause: '\uE034',
    skip_next: '\uE044',
    format_align_center: '\uE234',
    queue_music: '\uE03D',
    shuffle: '\uE043',
    repeat: '\uE040',
    repeat_one: '\uE041',
    volume_mute: '\uE04E',
    volume_down: '\uE04D',
    volume_up: '\uE050',
    volume_off: '\uE04F',
    cloud_download: '\uE2C0',
    play_circle_outline: '\uE039',
    delete: '\uE872',
    add: '\uE145',
    remove: '\uE15B',
    close: '\uE5CD',
    play_add: '\uE03B',
    share: '\uE80D',
    speaker: '\uE32D',
    search: '\uE8B6',
    folder: '\uE2C7',
    album: '\uE019',
    audiotrack: '\uE3A1',
    playlist_add: '\uE03B',
    content_copy: '\uE14D',
    live_tv: '\uE639',
    menu: '\uE5D2',
    arrow_back: '\uE5C4',
    access_time: '\uE192',
    home: '\uE88A',
    exit_to_app: '\uE879',
    note_add: '\uE89C',
    settings: '\uE8B8',
    supervisor_account: '\uE8D3',
    file_upload: '\uE2C6',
    dashboard: '\uE871',
    person_add: '\uE7FE',
    people: '\uE7FB',
    school: '\uE80C',
    view_comfy: '\uE42A',
    add_box: '\uE146',
    next_week: '\uE16A',
    content_paste: '\uE14F',
    create: '\uE150',
    web: '\uE051',
    view_list: '\uE8EF',
    work: '\uE8F9',
    archive: '\uE149',
    web_asset: '\uE069',
    local_shipping: '\uE558',
    photo_library: '\uE413',
    add_to_photos: '\uE39D',
    description: '\uE873',
    assignment: '\uE85D',
    assignment_ind: '\uE85E',
    library_add: '\uE02E',
    edit: '\uE3C9',
    cancel: '\uE5C9',
    save: '\uE161',
    security: '\uE32A',
    account_box: '\uE851',
    person: '\uE7FD',
    sort_by_alpha: '\uE053',
    sort: '\uE164',
    date_range: '\uE916',
    filter_list: '\uE152',
    more_horiz: '\uE5D3',
    filter: '\uE3D3',
    library_music: '\uE030',
    mic: '\uE029',
    favorite: '\uE87D',
    favorite_border: '\uE87E',
    check: '\uE5CA',
    loop: '\uE028',
    cloud_upload: '\uE2C3',
    location_on: '\uE0C8',
    refresh: '\uE5D5'
  };

  shouldComponentUpdate(nextProps, nextState) {
    let update = false;
    if (nextProps.name !== this.props.name) {
      update = true;
    }

    return update;
  }

  render() {
    let name = this.props.name || '';
    let icon = Icon.codes[name] ? Icon.codes[name] : '';
    let extraClass = this.props.className || '';
    let className = 'material-icons icon notranslate ' + extraClass;

    let extraProps = {};

    if (this.props.title) {
      extraProps.title = this.props.title;
    }
    if (this.props.onClick) {
      extraProps.onClick = this.props.onClick;
    }
    if (this.props.onTouchTap) {
      extraProps.onTouchTap = e => {
        e.preventDefault();
        this.props.onTouchTap();
      };
    }

    return (
      <i ariaHidden={true} {...extraProps} className={className}>
        {icon}
      </i>
    );
  }
}
