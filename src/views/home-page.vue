<template>
  <section class="home-page">
    <div class="hero">
      <div class="cta-hero">
        <p class="hero-txt">Boost your team's productivity with real-time sharable workspace.</p>
        <router-link class="cta-board-btn" to="/board/5e80aa10ca357df65afec6f8">Try tasky now</router-link>
      </div>
    </div>

    <section class="features-main">
      <div class="intro">
        <h3>The power of the internet is here</h3>
      </div>
      <div class="features-container">
        <div class="feature-main websocket">
          <img class="feature-image" src="../assets/img/homepage/feature1.png" />
          <div class="feature-info">
            <h2>Web Sockets</h2>
            <p>With the power of web sockets, you and your team can enjoy a workspace that updates in real-time, keeping everyone synced and up to date.</p>
          </div>
        </div>
        <div class="feature-main dnd">
          <div class="feature-info">
            <h2>Drag n Drop!</h2>
            <p>Try our Drag n Drop technology to easily move & update your tasks with your mouse or finger.</p>
          </div>
          <img class="feature-image" src="../assets/img/homepage/feature2.png" />
        </div>
        <div class="feature-main customize">
          <img class="feature-image" src="../assets/img/homepage/feature3.png" />
          <div class="feature-info">
            <h2>Make it yours.</h2>
            <p>Make it feel like home for you and your team. Customize the board's appearance, Organize your lists to fit the team's flow.</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
export default {};
</script>