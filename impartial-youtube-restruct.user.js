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
    hideChildAtIndex('.yt-lockup-meta-info', 0);
  } else if (window.location.pathname === '/results') {
    forEachEltWithClass('.yt-lockup-meta-info', v => {
      let i = 1;
      if (v.children.length === 1) i = 0;
      v.children[i].style.display = 'none';
    });
  } else if (window.location.pathname === '/feed/subscriptions') {
    hideChildAtIndex('.yt-lockup-meta-info', 0);
  } else if (window.location.pathname === '/feed/trending') {
    hideChildAtIndex('.yt-lockup-meta-info', 1);
  } else if (window.location.pathname === '/feed/history') {
    hideChildAtIndex('.yt-lockup-meta-info', 0);
  } else if (window.location.pathname === '/watch') {
    forEachEltWithClass('.view-count', v => v.style.display = 'none');
    document.querySelector('#watch8-sentiment-actions').style.display = 'none';
    document.querySelector('.yt-subscriber-count').style.display = 'none';

    let commentsHeader = document.querySelector('h2.comment-section-header-renderer');
    let sortMenu = document.querySelector('.comment-section-sort-menu');
    let comments = document.querySelector('#comment-section-renderer-items');
    let loadMoreBtn = document.querySelector('.load-more-text')
      .parentElement
      .parentElement;

    const commentsHeaderOriginalInnerHTML = commentsHeader.innerHTML;
    commentsHeader.innerHTML = '<b>Commentaires</b>';
    sortMenu.style.display = 'none';
    comments.style.display = 'none';
    loadMoreBtn.style.display = 'none';

    let showCommentsBtn = document.createElement('button');
    showCommentsBtn.innerHTML = 'Show comments';
    showCommentsBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more yt-uix-sessionlink comment-section-renderer-paginator';
    showCommentsBtn.style.display = 'block';
    showCommentsBtn.onclick = () => {
      commentsHeader.innerHTML = commentsHeaderOriginalInnerHTML;
      sortMenu.style.display = '';
      comments.style.display = '';
      loadMoreBtn.style.display = '';
      showCommentsBtn.style.display = 'none';
    };
    document.querySelector('#comment-section-renderer')
      .insertBefore(showCommentsBtn, loadMoreBtn);
  } else if (/^\/(user|channel)/.test(window.location.pathname)) {
    forEachEltWithClass('.view-count', v => v.style.display = 'none');
    hideChildAtIndex('.yt-lockup-meta-info', 0);
    forEachEltWithClass('.subscribed', v => v.style.display = 'none');

    if (/channels$/.test(window.location.pathname)) {
      forEachEltWithClass(
        '.yt-subscription-button-subscriber-count-unbranded-horizontal',
        v => v.style.display = 'none'
      );
    }
  }
}

function forEachEltWithClass (query, fn) {
  Array.prototype.forEach.call(document.querySelectorAll(query), fn);
}

function hideChildAtIndex (query, index) {
  forEachEltWithClass(query, v => v.children[index].style.display = 'none');
}
