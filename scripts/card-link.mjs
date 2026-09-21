const escape = value => String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

export const cardLinkLabel='View More';

export function renderCardLink({href,title,className}){
  if(!href)return '';
  return `<a href="${escape(href)}" class="content-link ${escape(className)}" aria-label="View more: ${escape(title)}">${cardLinkLabel} <span aria-hidden="true">→</span></a>`;
}
