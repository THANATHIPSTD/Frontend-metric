<script setup lang="ts">
import { onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'

onMounted(() => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidGhlY2hlZjI1NDYiLCJhIjoiY204YzBwNzh6MXR2azJxcHNhaTc1azhzeSJ9.bO5NVYdVEn-av3I1lJPk_g'

  const mapContainer = document.getElementById('map')

  if (mapContainer) {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [98.980556, 18.763444],
      zoom: 15,
    })

    new mapboxgl.Marker({ color: '#dc3545' })
      .setLngLat([98.980556, 18.763444])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<a href="https://maps.app.goo.gl/evhoxjcAoNvku2cJ7" class="text-decoration-none" target="_blank">DEKTEADGAME</a>',
        ),
      )
      .addTo(map)

    map.addControl(new mapboxgl.NavigationControl())
  }
})
</script>

<template>
  <footer class="bg-white/30 backdrop-blur-md text-gray-800 pt-13 pb-12 border-t border-zinc-300">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="md:col-span-6 lg:col-span-3">
          <h5 class="mb-3 font-bold text-lg">About Us</h5>
          <p class="text-sm text-gray-600">
            We are Chiang Mai's premier gaming destination, offering the latest titles across all
            platforms. Stay updated with exclusive news, promotions, and special events for true
            gaming enthusiasts.
          </p>
        </div>

        <div class="md:col-span-6 lg:col-span-2">
          <h5 class="mb-3 font-bold text-lg">Quick Links</h5>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-800 hover:text-blue-600 text-sm"
                >Home</router-link
              >
            </li>
            <li>
              <router-link to="/browse" class="text-gray-800 hover:text-blue-600 text-sm"
                >Games</router-link
              >
            </li>
            <li>
              <router-link to="#" class="text-gray-800 hover:text-blue-600 text-sm"
                >Promotions</router-link
              >
            </li>
            <li>
              <router-link to="#" class="text-gray-800 hover:text-blue-600 text-sm"
                >News</router-link
              >
            </li>
            <li>
              <router-link to="#" class="text-gray-800 hover:text-blue-600 text-sm"
                >Contact</router-link
              >
            </li>
          </ul>
        </div>

        <div class="md:col-span-6 lg:col-span-3">
          <h5 class="mb-3 font-bold text-lg">Contact Info</h5>
          <div class="flex flex-col space-y-3">
            <a
              href="tel:0979929190"
              class="flex items-center gap-2 text-sm text-gray-800 hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-telephone-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                />
              </svg>
              <span>097-992-9190</span>
            </a>
            <a
              href="mailto:someone@example.com"
              class="flex items-center gap-2 text-sm text-gray-800 hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-envelope"
                viewBox="0 0 16 16"
              >
                <path
                  d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"
                />
              </svg>
              <span>someone@example.com</span>
            </a>
            <div class="flex space-x-4 pt-2">
              <a href="#" class="text-gray-800 hover:text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-facebook"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-800 hover:text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-instagram"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="md:col-span-6 lg:col-span-4">
          <div class="shadow-sm rounded-lg overflow-hidden h-full flex flex-col">
            <div id="map" class="h-64 w-full"></div>
            <div class="p-4 bg-gray-50">
              <a
                href="https://maps.app.goo.gl/evhoxjcAoNvku2cJ7"
                target="_blank"
                class="block w-full text-center px-4 py-2 text-sm font-medium border border-gray-100 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
