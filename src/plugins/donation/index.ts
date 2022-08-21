import { defineAsyncComponent } from 'vue'
import type { CustomDonationBaseConfig } from './types'
import type { UserModule } from '~/types'

export const supportedDonationPlatforms: { [key: string]: CustomDonationBaseConfig } = {
  paypal: {
    donationBaseUrl: 'https://paypal.me',
    donationButtonImage: 'https://paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
  },
  buymeacoffee: {
    donationBaseUrl: 'https://buymeacoffee.com',
    donationButtonImage: 'https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png',
    donationButtonStyle: {
      height: '60px !important',
      width: '217px !important',
    },
  },
}

export const install: UserModule = ({ app }) => {
  const DonationButton = defineAsyncComponent(() => import('./components/DonationButton.vue'))
  app.component('DonationButton', DonationButton)

  const Donation = defineAsyncComponent(() => import('./components/Donation.vue'))
  app.component('Donation', Donation)
}
