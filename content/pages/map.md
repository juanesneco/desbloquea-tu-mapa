---
title: "Your Map"
layout: "map"
---

# Your Map

<div id="map-container">
  <div id="mission-progress">
    <!-- Mission points will be dynamically added here -->
  </div>
  
  <div id="current-mission" class="hidden">
    <h2 id="mission-title"></h2>
    <div id="mission-content"></div>
    <form id="reflection-form">
      <div class="form-group">
        <label for="reflection">Your Reflection</label>
        <textarea id="reflection" name="reflection" required minlength="200"></textarea>
      </div>
      <button type="submit">Submit Reflection</button>
    </form>
  </div>
  
  <div id="mission-complete" class="hidden">
    <h2>Mission Complete</h2>
    <p>Your reflection has been received. The next part of your map will be revealed when you're ready.</p>
    <a href="/map" class="button">Return to Map</a>
  </div>
</div>

<div id="map-overlay" class="hidden">
  <div class="overlay-content">
    <h2>Welcome to Your Map</h2>
    <p>This is where your journey begins. Each mission will reveal more of the map as you progress.</p>
    <button id="start-first-mission">Begin First Mission</button>
  </div>
</div> 