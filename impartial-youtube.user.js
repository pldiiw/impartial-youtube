// ==UserScript==
// @name        impartial-youtube
// @namespace   yt
// @include     https://www.youtube.com*
// @version     0.0.1
// @grant       none
// ==/UserScript==

'use strict';
const location = window.location; // for semistandard's sake
document.onreadystatechange = () => {
  //if (document.readyState === 'complete') impartial();
};
impartial();

function impartial () {
  if (location.pathname !== '/watch') {
    // hide views counts on home page, search page, trending page
    // and subscription page
    impartialNav();
  }
  else if (location.pathname === '/watch') {
    // tweaks on video page
    impartialWatch();
  }
  else if (location.pathname.slice(0, 5) === '/user') {
    // hide views counts and subscribers count on user's page, user's videos
    // page and channels page
    impartialUsers();
  }

  // TODO: hide subscribers count when hovering an username
  Array.prototype.forEach.call(
    document.querySelectorAll('.subscribed'),
    (v) => v.style.display = 'none'
  );
}

function impartialNav () {
  Array.prototype.forEach.call(
    document.querySelectorAll('.yt-lockup-meta-info'),
    (v) => {
      if (
        location.pathname === '/' ||
        location.pathname === '/feed/subscriptions'
      ) {
        v.childNodes[0].style.display = 'none';
      }
      else if (
        location.pathname === '/results' ||
        location.pathname === '/feed/trending' ||
        location.pathname === '/feed/history'
      ) {
        if (v.childNodes.length === 1) {
          v.childNodes[0].style.display = 'none';
        } else {
          v.childNodes[1].style.display = 'none';
        }
      }
    });
}

function impartialWatch () {
  // hide views counts in recommendations
  Array.prototype.forEach.call(
    document.querySelectorAll('.view-count'),
    (v) => v.style.display = 'none');

  // hide video's views and likes/dislikes bar and count
  document.querySelector('#watch8-sentiment-actions').style.display = 'none';

  // hide video's uploader's subscribers count
  document.querySelector('.yt-subscriber-count').style.display = 'none';

  const interval = window.setInterval(() => {
    if (impartialWatchComments()) clearInterval(interval);
  }, 100);
}

function impartialWatchComments () {
  if (document.querySelectorAll('.action-panel-loading').length === 4) {
    // hide comments and count
    let commentsHeader = document.querySelector('h2.comment-section-header-renderer');
    let sortMenu = document.querySelector('.comment-section-sort-menu');
    let comments = document.querySelector('#comment-section-renderer-items');
    let loadMoreBtn = document.querySelector('.comment-section-renderer-paginator');

    const commentsHeaderOriginalInnerHTML = commentsHeader.innerHTML;
    commentsHeader.innerHTML = '<b>Commentaires</b>';
    sortMenu.style.display = 'none';
    comments.style.display = 'none';
    loadMoreBtn.style.display = 'none';

    // add a button to display comments
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

    return true;
  } else {
    return false;
  }
}

function impartialUsers () {
  document.querySelector('.count').style.display = 'none';

  Array.prototype.forEach.call(
    document.querySelectorAll('.yt-lockup-meta-info'),
    (v) => {
      if (/\/user\/.*\/videos/.test(location.pathname)) {
        v.childNodes[0].style.display = 'none';
      } else {
        v.childNodes[0].style.display = 'none';
      }
    });

  document.querySelector('.subscribed').style.display = 'none';

  if (/\/user\/.*\/channels/.test(location.pathname)) {
    Array.prototype.forEach.call(
      document.querySelectorAll('.yt-subscription-button-subscriber-count-unbranded-horizontal'),
      (v) => v.style.display = 'none');
  }
}
