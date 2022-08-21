import { defineAsyncComponent } from 'vue'
import type { CustomDonationBaseConfig } from './types'
import type { UserModule } from '~/types'

export const supportedDonationPlatforms: { [key: string]: CustomDonationBaseConfig } = {
  buymeacoffee: {
    donationBaseUrl: 'https://buymeacoffee.com',
    donationButtonImage: 'https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png',
    donationButtonStyle: {
      height: '60px !important',
      width: '217px !important',
    },
  },
  kofi: {
    donationBaseUrl: 'https://ko-fi.com',
    donationButtonImage: 'https://storage.ko-fi.com/cdn/brandasset/kofi_bg_tag_white.png',
    donationButtonStyle: {
      height: '60px !important',
    },
  },
  paypal: {
    donationBaseUrl: 'https://paypal.me',
    donationButtonImage: 'https://paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
  },
}

export const install: UserModule = ({ app }) => {
  const DonationButton = defineAsyncComponent(() => import('./components/DonationButton.vue'))
  app.component('DonationButton', DonationButton)

  const Donation = defineAsyncComponent(() => import('./components/Donation.vue'))
  app.component('Donation', Donation)
}
