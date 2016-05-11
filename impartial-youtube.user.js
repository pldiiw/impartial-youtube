// ==UserScript==
// @name        impartial-youtube
// @namespace   yt
// @include     https://www.youtube.com*
// @version     0.0.1
// @grant       none
// ==/UserScript==

'use strict';

impartial();

function impartial () {
  if (window.location.pathname === '/') {
    // hide views counts on home page
    hideChildAtIndex('.yt-lockup-meta-info', 0);
  } else if (window.location.pathname === '/results') {
    // hide views counts on result page
    forEachEltWithClass('.yt-lockup-meta-info', v => {
      let i = 1;
      if (v.children.length === 1) i = 0; // if it is an ad
      v.children[i].style.display = 'none';
    });
  } else if (window.location.pathname === '/feed/subscriptions') {
    // hide views counts on subscriptions page
    hideChildAtIndex('.yt-lockup-meta-info', 0);
  } else if (window.location.pathname === '/feed/trending') {
    // hide views counts on trending page
    hideChildAtIndex('.yt-lockup-meta-info', 1);
  } else if (window.location.pathname === '/feed/history') {
    // hide views counts on history page
    hideChildAtIndex('.yt-lockup-meta-info', 0);
  } else if (window.location.pathname === '/watch') {
    // hide video's view count, likes and uploader's subscriber count
    forEachEltWithClass('.view-count', v => v.style.display = 'none');
    document.querySelector('#watch8-sentiment-actions').style.display = 'none';
    document.querySelector('.yt-subscriber-count').style.display = 'none';

    // hide video's comments
    let commentSection = document.querySelector('#comment-section-renderer');
    commentSection.style.display = 'none';

    // create a 'Show comments' button
    let showCommentsBtn = document.createElement('button');
    showCommentsBtn.innerHTML = 'Show comments';
    showCommentsBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more yt-uix-sessionlink comment-section-renderer-paginator';
    showCommentsBtn.style.display = 'block';
    showCommentsBtn.onclick = () => {
      showCommentsBtn.style.display = 'none';
      commentSection.style.display = '';
    };

    // display button
    document.querySelector('#watch-discussion').appendChild(showCommentsBtn);
  } else if (/^\/(user|channel)/.test(window.location.pathname)) {
    // hide views counts and subscribers count on a user page and user's videos page
    forEachEltWithClass('.view-count', v => v.style.display = 'none');
    hideChildAtIndex('.yt-lockup-meta-info', 0);
    forEachEltWithClass('.subscribed', v => v.style.display = 'none');

    // hide subscribers counts on user's channels page
    if (/channels$/.test(window.location.pathname)) {
      forEachEltWithClass(
        '.yt-subscription-button-subscriber-count-unbranded-horizontal',
        v => v.style.display = 'none');
    }
  }
}

function forEachEltWithClass (query, fn) {
  Array.prototype.forEach.call(document.querySelectorAll(query), fn);
}

function hideChildAtIndex (query, index) {
  forEachEltWithClass(query, v => v.children[index].style.display = 'none');
}
