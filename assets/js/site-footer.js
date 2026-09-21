/* Shared footer for every static page. Keep content and contact links here. */
(() => {
  const template = document.createElement('template');
  template.innerHTML = `
<div class="footer-inner">
    <div class="footer-contact">
    <p>If you would like to collaborate on a project or to just meet up for some drinks, feel free to contact me
    through any of these channels. I'll probably respond faster through either telegram or email though!</p>
    <div class="footer-links" id="note">
    <ul class="contact-icons">
    <li><a href="https://github.com/JinBean" target="_blank" rel="noopener noreferrer"><span class="icon brands fa-github" aria-hidden="true"></span><span>JinBean</span></a></li>
    <li><a href="https://t.me/WeiJinn" target="_blank" rel="noopener noreferrer"><span class="icon brands fa-telegram-plane" aria-hidden="true"></span><span>@WeiJinn</span></a></li>
    <li><a href="mailto:weijin96@hotmail.com"><span class="icon fa-envelope" aria-hidden="true"></span><span>weijin96</span></a></li>
    <li><a href="https://linkedin.com/in/tanweijin/"
    target="_blank" rel="noopener noreferrer"><span class="icon brands fa-linkedin-in" aria-hidden="true"></span><span>linkedin/tanweijin</span></a></li>
    <li><a href="https://steamcommunity.com/id/icycool3789"
    target="_blank" rel="noopener noreferrer"><span class="icon brands fa-steam-symbol" aria-hidden="true"></span><span>Quisling</span></a></li>
    </ul>
    </div>
    </div>

    <div class="copyright">&copy; TanWeiJin. Design: <a href="https://html5up.net">HTML5 UP</a>.</div>
    </div>
  `;
  document.querySelectorAll('footer[data-site-footer]').forEach(footer => {
    footer.replaceChildren(template.content.cloneNode(true));
    const emailLink = footer.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      const address = decodeURIComponent(emailLink.getAttribute('href').slice(7).split('?')[0]);
      emailLink.title = `Email ${address}`;
      emailLink.setAttribute('aria-label', `Email ${address}`);
    }
  });
})();
