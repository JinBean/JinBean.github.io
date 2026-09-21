---
title: "Glimpse: A Public Space Project"
page_title: "GLIMPSE: A PUBLIC SPACE PROJECT"
category: "Computer vision"
section: "project"
order: 2
excerpt: "A potential solution to imperfect information regarding the usage of public spaces. Uses computer vision to detect the number of people using each public space, which can then be viewed through an app."
permalink: "/glimpse.html"
subtitle: "A potential solution to imperfect information regarding the usage of public spaces."
---

<h2 class="major">About</h2>
<p>Singapore has a large number of recreational spaces in every neighbourhood that are free for everyone to use. These spaces include basketball courts, badminton courts, street soccer courts, and even playgrounds. However, the want to use these public spaces can be hindered by the lack of knowledge as to whether the space is occupied at any given time. This problem has yet to been solved even till today. Our project aims at solving this problem in an effective and convenient way.</p>

<p>Our solution includes adding a small camera that overlooks each space. This camera, with the help of computer vision, will help identify the total number people using the facility at every given period of time. This information is then sent to a central database. The data is pulled by a phone application which can then be accessed by everyone with that application installed. Only the numerical capacity will be displayed on the app and not the pictures taken as to provide as much information as possible while still maintaining privacy.</p>

<h2 class="major">Implementation</h2>
<p>As a proof of concept, we applied our solution on a smaller scale within our school campus.

We used a small web camera to monitor two pool tables. A LattePanda is then used to simulate a back-end to detect people using a convolusional neural network which then pushes the final data to a common database. The camera takes a photo of the tables every 30 seconds. Once the detection is done on these photos, the identified number of people as well as the date and time is pushed to firebase.</p>

<h2 class="major">Improvements</h2>
<p>Some improvements that could be made would involve a server that is able to handle more computationally intensive processing. This could allow for a real time detection stream, as well as the blurring out of people's faces for additional privacy.</p>

<section class="features">
<article>

<h2 class="major">GitHub Repository</h2>
<p>Here are the source files for the project. It includes screenshots of the application as well as short descriptions for each page.</p>
<a href="https://github.com/JinBean/Glimpse" class="special" aria-label="Learn more: GitHub Repository">Learn more</a>
</article>
</section>
