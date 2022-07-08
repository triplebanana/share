// Copyright 2022 The Triple Banana Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly DEFAULT_BANNER_DESCRIPTION: string = "Safer, faster, and more stable"
  bannerDescription = this.DEFAULT_BANNER_DESCRIPTION

  ngOnInit(): void {
    // Parse parameters as url and move
  }

  onBannerClicked() {
    // If browser is chromium based,
    // it is allowed to move only when user click action
  }
}
