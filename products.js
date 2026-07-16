const products = [
  {
    id: "aura-glow-sphere",
    name: "Aura Glow Sphere",
    category: "lighting",
    categoryLabel: "Smart Lighting",
    price: 129,
    rating: 4.8,
    reviews: 243,
    image: "assets/aura-lamp.png",
    tagline: "Synchronized Mood Lighting",
    description: "An immersive smart orb lamp that syncs with your music, mood, and sleep cycle. Features over 16 million colors, premium glass construction, and custom light animations created via our touch-sensitive interface or mobile app.",
    features: [
      "Music Sync Mode with internal mic",
      "Intuitive glass touch control panel",
      "App, Google Assistant & Alexa voice control",
      "Circadian Sleep Schedule Assistant"
    ],
    specs: {
      "Dimensions": "8.0 x 8.0 x 8.0 inches",
      "Connectivity": "Wi-Fi (2.4 GHz) & Bluetooth 5.0",
      "Power Source": "USB-C (Includes 15W adapter)",
      "Bulb Lifespan": "50,000 Hours",
      "Brightness": "800 Lumens max"
    }
  },
  {
    id: "aura-halo-speaker",
    name: "Aura Halo Speaker",
    category: "sound",
    categoryLabel: "Ambient Sound",
    price: 189,
    rating: 4.9,
    reviews: 312,
    image: "assets/aura-speaker.png",
    tagline: "360° Sound & Neon Halo",
    description: "A high-fidelity cylindrical smart speaker featuring a 360-degree acoustic driver and a customizable neon RGB crown. Experience rich, enveloping audio matched to pulsating, ambient neon color waves.",
    features: [
      "360° Omnidirectional acoustic engine",
      "Neon RGB Crown with music-reactive light animations",
      "Stereo pairing (connect two speakers together)",
      "Rechargeable battery providing up to 12 hours of play"
    ],
    specs: {
      "Dimensions": "4.2 x 4.2 x 7.5 inches",
      "Connectivity": "Bluetooth 5.2, AirPlay 2, Spotify Connect",
      "Power Output": "40W RMS",
      "Battery Capacity": "5,200 mAh Lithium-ion",
      "Frequency Response": "45Hz - 20kHz"
    }
  },
  {
    id: "aura-horizon-soundbar",
    name: "Aura Horizon Soundbar",
    category: "sound",
    categoryLabel: "Ambient Sound",
    price: 299,
    rating: 4.7,
    reviews: 156,
    image: "assets/aura-soundbar.png",
    tagline: "Cinematic Audio & Ambient Projection",
    description: "Our premium home theater soundbar with virtual Dolby Atmos and intelligent rear wall lighting. Project high-definition spatial audio forward while bathing your wall in matching ambient hues.",
    features: [
      "Virtual Dolby Atmos 5.1 spatial immersion",
      "Rear-projecting LED wall glow (matches screen contrast)",
      "Dedicated dialog enhancement mode",
      "High-speed HDMI eARC input for lossless audio"
    ],
    specs: {
      "Dimensions": "36.0 x 3.5 x 2.2 inches",
      "Connectivity": "HDMI eARC, Optical Input, Wi-Fi, AirPlay 2",
      "Audio Channels": "5.1 Virtual Surround",
      "Color Temperature": "2200K (Warm Glow) - 6500K (Cool Daylight)",
      "Power Output": "150W Peak"
    }
  },
  {
    id: "aura-hexa-panels",
    name: "Aura Hexa Panels",
    category: "lighting",
    categoryLabel: "Smart Lighting",
    price: 149,
    rating: 4.6,
    reviews: 98,
    image: "assets/aura-panels.png",
    tagline: "Modular Geometric Light Art",
    description: "Modular smart LED panels that easily mount to your wall in any layout. Create touch-responsive art installations, setup screen-matching illumination, or visualizers for your audio setup.",
    features: [
      "Modular snap-and-go magnetic connector system",
      "Touch-sensitive panels change colors upon contact",
      "Integrated audio visualizer with zero-latency mic",
      "Custom desk setups screen mirroring option"
    ],
    specs: {
      "Dimensions": "7.0 x 6.0 inches per panel",
      "Box Contents": "9 Hexa Panels, Controller, Power Supply, Tape",
      "Max Power Supply": "Up to 30 panels per controller",
      "Connectivity": "Wi-Fi (2.4 GHz only)",
      "Colors": "16.7 Million Colors + Tunable White"
    }
  },
  {
    id: "aura-neon-flex",
    name: "Aura Neon Flex Strip",
    category: "lighting",
    categoryLabel: "Smart Lighting",
    price: 59,
    rating: 4.5,
    reviews: 114,
    image: "assets/aura-lamp.png",
    tagline: "Diffuse Seamless LED Ribbon",
    description: "A highly flexible, matte-diffuse LED lightstrip designed to outline architectural details, desks, or furniture. Delivers seamless gradient transitions across multiple color zones simultaneously.",
    features: [
      "Silicone-diffused, dot-free neon light representation",
      "100+ addressable pixel zones for multi-color gradients",
      "Flexible, bendable structure with mounting brackets",
      "IP65 weather resistant for bathroom or patio installs"
    ],
    specs: {
      "Length": "16.4 feet (5 meters)",
      "Connectivity": "Bluetooth & Wi-Fi",
      "Power Adapter": "24V Power Brick (Included)",
      "Dimmable Range": "1% - 100% via application",
      "Color Segments": "50 independent addressable zones"
    }
  },
  {
    id: "aura-wave-panel",
    name: "Aura Wave Acoustic Diffuser",
    category: "sound",
    categoryLabel: "Ambient Sound",
    price: 89,
    rating: 4.4,
    reviews: 64,
    image: "assets/aura-speaker.png",
    tagline: "Sound Absorption & Backlit Accent",
    description: "An elegant, high-density acoustic panel wrapped in premium sound-absorbing felt with a built-in warm LED backlit board. Drastically reduces room echo while casting soft, golden accent illumination.",
    features: [
      "High Coefficient of Noise Reduction (NRC: 0.85)",
      "Back-facing warm glow LED board",
      "Modular design for stunning wall collage creation",
      "Made from 60% post-consumer recycled eco-friendly felt"
    ],
    specs: {
      "Dimensions": "12.0 x 24.0 x 2.0 inches",
      "Materials": "Recycled PET acoustic felt & dense backing foam",
      "Lighting Color": "Warm White (3000K) or Golden Candlelight (1800K)",
      "Power Source": "USB 5V (USB cable included)",
      "Installation": "Tool-less adhesive strip mount"
    }
  }
];

// Export for common use if in node or let it sit in global scope for vanilla browser JS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}
