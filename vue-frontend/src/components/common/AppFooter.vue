<template>
  <!-- Footer -->
  <el-footer class="main-footer">
    <div class="footer-container">
      <!-- Footer Links -->
      <el-row :gutter="30" class="footer-sections">
        <el-col
          v-for="section in footerSections"
          :key="section.title"
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
        >
          <div class="footer-section">
            <h3 class="footer-title">{{ section.title }}</h3>
            <ul class="footer-links">
              <li v-for="link in section.links" :key="link.text">
                <el-link :href="link.href" class="footer-link">
                  {{ link.text }}
                </el-link>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>

      <!-- Contact Info & Social Media -->
      <el-row :gutter="30" class="footer-contact-section">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="footer-section">
            <h3 class="footer-title">Contact Information</h3>
            <div class="contact-items">
              <div class="contact-item">
                <el-icon class="contact-icon"><Phone /></el-icon>
                <span class="contact-text">+63 2 8123 4567</span>
              </div>
              <div class="contact-item">
                <el-icon class="contact-icon"><Message /></el-icon>
                <span class="contact-text">support@lazada.com.ph</span>
              </div>
              <div class="contact-item">
                <el-icon class="contact-icon"><Location /></el-icon>
                <span class="contact-text">Manila, Philippines</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- Social Media -->
        <el-col :xs="24" :sm="12" :md="8">
          <div class="footer-section">
            <h3 class="footer-title">Follow Us</h3>
            <div class="social-icons">
              <el-button circle class="social-button facebook" @click="openAboutDialog">
                f
              </el-button>
              <el-button circle class="social-button twitter" @click="openAboutDialog">
                t
              </el-button>
              <el-button circle class="social-button instagram" @click="openAboutDialog">
                i
              </el-button>
              <el-button circle class="social-button youtube" @click="openAboutDialog">
                y
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- Footer Bottom -->
      <el-divider class="footer-divider" />
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">&copy; {{ currentYear }} Lazada Philippines. All rights reserved.</p>
          <div class="footer-bottom-links">
            <el-link href="#" class="footer-bottom-link">Privacy Policy</el-link>
            <el-link href="#" class="footer-bottom-link">Terms of Service</el-link>
            <el-link href="#" class="footer-bottom-link">Cookies Policy</el-link>
          </div>
        </div>
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts">
import { footerSections } from '@/constants/index'
import { ref } from 'vue'

// Reactive state
const aboutDialogVisible = ref<boolean>(false)
const currentYear = new Date().getFullYear()

// Event handlers
const openAboutDialog = (): void => {
  aboutDialogVisible.value = true
}
</script>

<style scoped>
/* Footer Styles */
.main-footer {
  background-color: #181818;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-sections {
  margin-bottom: 40px;
}

.footer-section {
  margin-bottom: 30px;
}

.footer-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 15px 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-link {
  color: #bdc3c7 !important;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #ff6600 !important;
}

.footer-contact-section {
  margin-bottom: 30px;
}

.footer-divider {
  border-color: #34495e;
  margin: 30px 0 20px;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.copyright {
  color: #bdc3c7;
  font-size: 14px;
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  gap: 20px;
}

.footer-bottom-link {
  color: #bdc3c7 !important;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-bottom-link:hover {
  color: #ff6600 !important;
  text-decoration: none;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-button {
  width: 40px;
  height: 40px;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  transition: transform 0.2s ease;
}

.social-button:hover {
  transform: translateY(-2px);
}

.social-button.facebook {
  background-color: #3b5998;
}

.social-button.twitter {
  background-color: #1da1f2;
}

.social-button.instagram {
  background-color: #e1306c;
}

.social-button.youtube {
  background-color: #ff0000;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-icon {
  color: #ff6600;
  font-size: 16px;
}

.contact-text {
  color: #bdc3c7;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-bottom-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
