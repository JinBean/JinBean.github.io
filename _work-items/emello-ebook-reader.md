---
title: "eMello eBook Reader"
page_title: "EMELLO EBOOK READER"
category: "Machine learning"
section: "project"
order: 4
excerpt: "eMello is an eBook reader that employs machine learning and natural language processing to integrate instrumental music into children’s books."
permalink: "/eMello.html"
subtitle: "eMello is an eBook reader that employs machine learning and natural language processing to integrate instrumental music into children’s books."
---

<h2 class="major">About</h2>
<p>As part of a project from the <a href="zhejiang">ASEAN Leadership Programme</a>, my group and I built an eBook reader that allows for the incorporation of an additional auditory stimulant to eBooks.
eMello takes any ePUB file and selects appropriate background music for each page by analysing its text and embeds them into the book to enhance the reading experience.
As an additional feature, pop-ups are also created and tagged to difficult words, explaining their meanings to the user, in order to improve the child’s command of the language.
</p>

<p>eMello was submitted for the <a href="http://www.appcontest.net/2018/introductionChina">Mobile Application Innovation Contest 2018</a> and placed top 30 out of
more than 200 participating groups. We were later invited back to China for the finals of the competition, but unfortunately had to withdraw due to prior school commitments.</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Y1b2EJdbMP0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<br><br><br>
<h2 class="major">How We Built It</h2>
<p>Using XCode, we built an iOS application that uses children’s eBooks uploaded into it and by passing them through a Natural Language Processing (NLP) tool, IBM’s Watson, we attained a tonal score.

Using the tone and score provided for each page, the application accesses the relevant music databases to attain a corresponding track to tag to each page of the eBook.

The final result is an eBook that plays a set track on each page. The book is then placed within the users’ library for them enjoy and experience with the music.</p>

<section class="features">
<article>

<h2 class="major">eMello Thesis Paper</h2>
<p>We wrote a detailed explanation of our methodology. All references can also be found in the thesis paper.</p>
<a href="https://github.com/JinBean/eMello/blob/master/eMello%20Thesis.pdf" class="special" aria-label="Learn more: eMello Thesis Paper">Learn more</a>
</article>
<article>

<h2 class="major">GitHub Repository</h2>
<p>Here are the source files for the project.</p>
<br>
<a href="https://github.com/JinBean/eMello" class="special" aria-label="Learn more: GitHub Repository">Learn more</a>
</article>
</section>
