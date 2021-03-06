// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });

    document.body.appendChild(button); 
  }
}
constructOptions(kButtonColors);

function restoreOptions() {
  chrome.storage.sync.get({
    url: '',
    token: '',
    weight: ''
  }, function(items) {
    document.getElementById('url').value = items.url;
    document.getElementById('token').value = items.token;
    document.getElementById('weight').value = items.weight;
  });
}

function saveOptions() {
  var url = document.getElementById('url').value;
  var token = document.getElementById('token').value;
  var weight = document.getElementById('weight').value;
  chrome.storage.sync.set({
    url: url,
    token: token,
    weight: weight
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
      window.close();
    }, 750);
  });

}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);