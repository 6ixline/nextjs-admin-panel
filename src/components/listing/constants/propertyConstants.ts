export const PROPERTY_FORM_CONSTANTS = {
    OWNER_TYPES: [
      { value: "owner", label: "Owner" },
      { value: "broker_builder", label: "Broker / Builder" },
    ],
  
    PROPERTY_TYPES: [
      { value: "residential", label: "Residential" },
      { value: "commercial", label: "Commercial" },
    ],
  
    SERVICE_TYPES: {
      ALL: [
        { value: "rent", label: "Rent" },
        { value: "sell", label: "Sell" },
        { value: "pg", label: "PG/Co-living" },
      ],
      
      getByPropertyType: (propertyType: string) => {
        switch (propertyType) {
          case "residential":
            return [
              { value: "rent", label: "Rent" },
              { value: "sell", label: "Sell" },
              { value: "pg", label: "PG/Co-living" },
            ];
          case "commercial":
            return [
              { value: "rent", label: "Rent" },
              { value: "sell", label: "Sell" },
            ];
          default:
            return [];
        }
      }
    },
  
    BHK_OPTIONS: [
      { value: 1, label: "1 RK" },
      { value: 2, label: "1 BHK" },
      { value: 3, label: "1.5 BHK" },
      { value: 4, label: "2 BHK" },
      { value: 5, label: "3 BHK" },
      { value: 6, label: "4 BHK" },
      { value: 7, label: "5 BHK" },
      { value: 8, label: "6 BHK" },
      { value: 9, label: "7 BHK" },
      { value: 10, label: "8 BHK" },
      { value: 11, label: "9 BHK" },
      { value: 12, label: "10 BHK" },
    ],
  
    AREA_UNITS: [
      { value: "sq_ft", label: "sq. ft." },
      { value: "sq_yd", label: "sq. yd." },
      { value: "sq_mt", label: "sq. mt." },
      { value: "acre", label: "Acre" },
      { value: "bigha", label: "Bigha" },
    ],
  
    FURNISH_TYPES: [
      { value: "fully_furnished", label: "Fully Furnished" },
      { value: "semi_furnished", label: "Semi Furnished" },
      { value: "unfurnished", label: "Unfurnished" },
    ],
  
    SECURITY_DEPOSIT_OPTIONS: [
      { value: "1", label: "None" },
      { value: "2", label: "1 month" },
      { value: "3", label: "2 month" },
      { value: "4", label: "Custom" },
    ],
  
    STATUS_OPTIONS: [
      { value: "inreview", label: "In Review" },
      { value: "available", label: "Available" },
      // { value: "unavailable", label: "Unavailable" },
      { value: "inactive", label: "Inactive" },
      { value: "rejected", label: "Rejected" },
    ],
  
    FILE_LIMITS: {
      MAX_IMAGES: 10,
      MAX_DOCUMENTS: 5,
    },
  
    FILE_TYPES: {
      IMAGES: ['image'],
      DOCUMENTS: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    },
    POSSESSION_STATUS: [
      {value: "ready_to_move", label : "Ready to Move"},
      {value: "under_construction", label: "Under Construction"},
    ],
    
    ZONE_TYPES : [
      {value: "industrial", label: "Industrial"},
      {value: "commercial", label: "Commercial"},
      {value: "residential", label: "Residential"},
      {value: "special_economic_zone", label: "Special economic zone"},
      {value: "open_spaces", label: "Open Spaces"},
      {value: "agricultural_zone", label: "Agricultural Zone"},
      {value: "others", label: "Others"},
    ],
    
    LOCATION_HUB : {
      "1": [
          {value: "it_park", label: "IT Park"},
          {value: "business_park", label: "Business Park"},
          {value: "others", label: "Others"},
      ],
      "2": [
          {value: "mall", label: "Mall"},
          {value: "commercial_project", label: "Commercial Project"},
          {value: "residential_project", label: "Residential Project"},
          {value: "retail_complex_building", label: "Retail Complex/Building"},
          {value: "market_high_steet", label: "Market/High Steet"},
          {value: "others", label: "Others"},
      ],
      "3": [
          {value: "mall", label: "Mall"},
          {value: "commercial_project", label: "Commercial Project"},
          {value: "residential_project", label: "Residential Project"},
          {value: "retail_complex_building", label: "Retail Complex/Building"},
          {value: "market_high_steet", label: "Market/High Steet"},
          {value: "others", label: "Others"},
      ],
      "4": [
          {value: "mall", label: "Mall"},
          {value: "commercial_project", label: "Commercial Project"},
          {value: "residential_project", label: "Residential Project"},
          {value: "retail_complex_building", label: "Retail Complex/Building"},
          {value: "market_high_steet", label: "Market/High Steet"},
          {value: "others", label: "Others"},
      ],
      "6": [
          {value: "mall", label: "Mall"},
          {value: "commercial_project", label: "Commercial Project"},
          {value: "residential_project", label: "Residential Project"},
          {value: "retail_complex_building", label: "Retail Complex/Building"},
          {value: "market_high_steet", label: "Market/High Steet"},
          {value: "others", label: "Others"},
      ],
    },
    
    PROPERTY_CONDITION : [
      {value: "ready_to_use", label: "Ready to use"},
      {value: "bare_shell", label: "Bare shell"},
    ],
    
    OWNERSHIP : [
      {value: "freehold", label: "Freehold"},
      {value: "leasehold", label: "Leasehold"},
      {value: "cooperative_society", label: "Cooperative society"},
      {value: "power_of_attorney", label: "Power of attorney"},
    ],
    
    CONSTRUCTION_STATUS : [
      {value: "no_walls", label: "No walls"},
      {value: "brick_walls", label: "Brick walls"},
      {value: "cemented_walls", label: "Cemented walls"},
      {value: "plastered_walls", label: "Plastered walls"},
    ]
  } as const;