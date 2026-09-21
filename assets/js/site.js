/* Progressive enhancement: reading and navigation also work without JavaScript. */
document.body.classList.remove('is-preload');
// Return to the originating blog list without adding another history entry.
// Direct visits keep the ordinary category link as a no-JavaScript fallback.
const articleBack = document.querySelector('.journal #header a.logo');
if (articleBack && document.referrer) {
  const previous = new URL(document.referrer);
  const blogList = /\/blog\/(?:index|personal_developer|personal_alumni|personal_art)(?:\.html)?\/?$/;
  if (previous.origin === location.origin && blogList.test(previous.pathname)) {
    articleBack.href = previous.href;
    articleBack.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (history.length > 1) {
        event.preventDefault();
        history.back();
      }
    });
  }
}
const solutionToggle = document.querySelector('.spoilerbutton');
const solution = document.getElementById('ctf-solution');
if (solutionToggle && solution) {
  solutionToggle.addEventListener('click', () => {
    const expanded = solutionToggle.getAttribute('aria-expanded') !== 'true';
    solution.hidden = !expanded;
    solutionToggle.setAttribute('aria-expanded', String(expanded));
    solutionToggle.textContent = expanded ? 'Hide Solution' : 'Show Solution';
  });
}
document.querySelectorAll('a[target="_blank"]').forEach(link => { link.rel = 'noopener noreferrer'; });

