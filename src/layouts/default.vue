<template>
  <SectionContainer>
    <div class="flex flex-col justify-between h-screen">
      <main class="mb-auto">
        <Header />
        <router-view />
      </main>
      <Footer />
    </div>
  </SectionContainer>
</template>
