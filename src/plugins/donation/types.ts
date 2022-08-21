export declare interface DonationPluginConfig {
  paypal?: string
  buymeacoffee?: string
  custom?: {
    [key: string]: CustomDonationConfig
  }
}

export declare interface CustomDonationBaseConfig {
  donationBaseUrl: string
  donationButtonImage: string
  donationButtonStyle?: Record<string, string>
}

export declare interface CustomDonationConfig extends CustomDonationBaseConfig {
  donationId: string
}
