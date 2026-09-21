---
title: "Capture The Flag Mini-Challenge"
page_title: "Capture The Flag Mini-Challenge"
category: "Cybersecurity"
section: "project"
order: 3
excerpt: "As part of a cybersecurity course, my team and I created a challenge for a jeopardy style Capture The Flag (CTF). The challenge includes basic CTF skills including cryptography and stenography."
permalink: "/ctf.html"
subtitle: "As part of a cybersecurity course, my team and I created a challenge for a jeopardy style Capture The Flag (CTF)."
---

<h2 class="major">Challenge</h2>
<p>The challenge can be found <a href="https://tlkh.github.io/cc-ctf-challenge/" target="_blank" rel="noopener noreferrer">here</a></p>

<p>Due to the learning objectives of the course, the challenge is designed to be doable for people who are new to CTFs.
The challenge includes basic CTF skills including (but not limited to) cryptography and stenography.</p>

<h2 class="major">CTF Walkthrough</h2>
<button class="spoilerbutton" type="button" aria-expanded="false" aria-controls="ctf-solution">Show Solution</button>
<div class="spoiler" id="ctf-solution" hidden><div>

<p>  </p>
<ol type="1">
<li>Query the terminal server using <code>remi</code> to read the initial story</li>
<li>Query the terminal server with <code>inventory find meatballs</code> and download the image "meatballs.jpg"</li>
<li>Run <code>strings meatballs.jpg</code> in your terminal to obtain a ciphertext "pASARFeDXPsj4V5u7qTOYoHzljCS+lc8YmSG/IiYJq74qKT3fcQAvuT24WJlMoMIinB9eKYGbR4FXRsAZ+kdbrytAmSDxFv33YARollK0IvXBVgVLsE9dmGghi71J9FP". Store this away for now.</li>
<li>Query the terminal server with <code>inventory find spaghetti</code> and download the image "spaghetti.jpg"</li>
<li>Use <code>steghide -extract -sf spaghetti.jpg</code> in your terminal with the password "spaghetti" to extract a file "recipe.txt"</li>
<li>Enter the contents of "recipe.txt" through an online <a href="http://p-helpers.appspot.com/chef/chef.html" target="_blank" rel="noopener noreferrer">Chef Esolang decoder</a> to obtain the ciphertext "PurrflTneyvpXabg"</li>
<li>Rot13 the ciphertext to obtain the key "CheesyGarlicKnot</li>
<li>You can query the terminal server with <code>inventory find CheesyGarlicKnot</code> to obtain more clues</li>
<li>AES-ECB decrypt the ciphertext obtained from "meatballs.jpg" with "CheesyGarlicKnot" as the key to obtain the ciphertext "6b6261721244591492597245de07dbef1626b472244f340614f9083c6e683a7c046c0f0a46360f5b"</li>
<li>Query the terminal with <code>remi 6b6261721244591492597245de07dbef1626b472244f340614f9083c6e683a7c046c0f0a46360f5b</code> to get a python file "door.py"</li>
<li>Decipher the plaintext by reverse-engineering “door.py” and un-map the ciphertext to get "4354467b346c6c5f6a3030725f663030647a5f3472335f62336c306e675f325f6d335f6e3077217d"</li>
<li>Hex decode the ciphertext to get the flag “ctf{4ll_j00r_f00dz_4r3_b3l0ng_2_m3_n0w!}”</li>
</ol>

</div>
</div>
