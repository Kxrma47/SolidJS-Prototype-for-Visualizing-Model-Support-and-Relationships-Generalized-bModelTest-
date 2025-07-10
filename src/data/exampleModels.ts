
export const exampleData = {
  models: [
    { id: "111111", support: 0.090000, inHPD: true,  label: "JC69"      },
    { id: "111121", support: 0.050000, inHPD: true,  label: "F81"       },
    { id: "111123", support: 0.045000, inHPD: true,  label: "K80"       },

    { id: "121121", support: 0.125000, inHPD: true,  label: "HKY85"     },
    { id: "121123", support: 0.095000, inHPD: true,  label: "TN93"      },
    { id: "121131", support: 0.060000, inHPD: true,  label: "TVM"       },
    { id: "121134", support: 0.045000, inHPD: true,  label: "TrNuf"     },

    { id: "121321", support: 0.030000, inHPD: true,  label: "SYM"       },
    { id: "121323", support: 0.030000, inHPD: true,  label: "TIM2"      },
    { id: "121324", support: 0.025000, inHPD: true,  label: "TIM3"      },

    { id: "121341", support: 0.020000, inHPD: true,  label: "TVM+F"     },
    { id: "121343", support: 0.018000, inHPD: true,  label: "TPM1"      },
    { id: "121345", support: 0.015000, inHPD: true,  label: "TPM2"      },

    { id: "123121", support: 0.014000, inHPD: true,  label: "M85"       },
    { id: "123123", support: 0.013000, inHPD: true,  label: "M95"       },
    { id: "123124", support: 0.012000, inHPD: true,  label: "M112"      },
    { id: "123141", support: 0.011000, inHPD: true,  label: "M125"      },
    { id: "123143", support: 0.010000, inHPD: true,  label: "Posada 03" },
    { id: "123145", support: 0.010000, inHPD: true,  label: "M138"      },

    { id: "123321", support: 0.009000, inHPD: true,  label: "Kimura 81" },
    { id: "123323", support: 0.008000, inHPD: true,  label: "M147"      },
    { id: "123324", support: 0.008000, inHPD: true,  label: "NEW2"      },
    { id: "123341", support: 0.007000, inHPD: true,  label: "M166"      },

    { id: "123343", support: 0.007000, inHPD: false, label: "M179"      },
    { id: "123345", support: 0.007000, inHPD: false, label: "M183"      },
    { id: "123421", support: 0.006000, inHPD: false, label: "M189"      },
    { id: "123423", support: 0.006000, inHPD: false, label: "M191"      },
    { id: "123424", support: 0.006000, inHPD: false, label: "M198"      },
    { id: "123425", support: 0.005000, inHPD: false, label: "M200"      },
    { id: "123451", support: 0.005000, inHPD: false, label: "M201"      },
    { id: "123453", support: 0.004000, inHPD: false, label: "M207"      },
    { id: "123454", support: 0.004000, inHPD: false, label: "M211"      },

    { id: "123456", support: 0.200000, inHPD: true,  label: "GTR"       }
  ],

  links: [

    { source: "111111", target: "111121" },
    { source: "111111", target: "111123" },
    { source: "111111", target: "121121" },
    { source: "111121", target: "121121" },
    { source: "111123", target: "121121" },


    { source: "121121", target: "121123" },
    { source: "121121", target: "121131" },
    { source: "121121", target: "121321" },
    { source: "121121", target: "121323" },
    { source: "121121", target: "123121" },
    { source: "121121", target: "123123" },
    { source: "121121", target: "123321" },
    { source: "121121", target: "123323" },

    { source: "121123", target: "121134" },
    { source: "121123", target: "121324" },
    { source: "121123", target: "123124" },
    { source: "121123", target: "123324" },

    { source: "121131", target: "121134" },
    { source: "121131", target: "121341" },
    { source: "121131", target: "121343" },
    { source: "121131", target: "123141" },
    { source: "121131", target: "123143" },
    { source: "121131", target: "123341" },
    { source: "121131", target: "123343" },

    { source: "121134", target: "121345" },
    { source: "121134", target: "123145" },
    { source: "121134", target: "123345" },

    { source: "121321", target: "121324" },
    { source: "121321", target: "121341" },
    { source: "121321", target: "123421" },
    { source: "121321", target: "123423" },

    { source: "121323", target: "121324" },
    { source: "121323", target: "121343" },
    { source: "121323", target: "123424" },

    { source: "121324", target: "121345" },
    { source: "121324", target: "123425" },

    { source: "121341", target: "121345" },
    { source: "121341", target: "123451" },
    { source: "121341", target: "123453" },

    { source: "121343", target: "121345" },
    { source: "121343", target: "123454" },

    { source: "121345", target: "123456" },

    { source: "123121", target: "123124" },
    { source: "123121", target: "123141" },
    { source: "123121", target: "123421" },
    { source: "123121", target: "123424" },

    { source: "123123", target: "123124" },
    { source: "123123", target: "123143" },
    { source: "123123", target: "123423" },

    { source: "123124", target: "123145" },
    { source: "123124", target: "123425" },

    { source: "123141", target: "123145" },
    { source: "123141", target: "123451" },
    { source: "123141", target: "123454" },

    { source: "123143", target: "123145" },
    { source: "123143", target: "123453" },

    { source: "123145", target: "123456" },

    { source: "123321", target: "123324" },
    { source: "123321", target: "123341" },
    { source: "123321", target: "123421" },

    { source: "123323", target: "123324" },
    { source: "123323", target: "123343" },
    { source: "123323", target: "123423" },
    { source: "123323", target: "123424" },

    { source: "123324", target: "123345" },
    { source: "123324", target: "123425" },

    { source: "123341", target: "123345" },
    { source: "123341", target: "123451" },

    { source: "123343", target: "123345" },
    { source: "123343", target: "123453" },
    { source: "123343", target: "123454" },

    { source: "123345", target: "123456" },

    { source: "123421", target: "123425" },
    { source: "123421", target: "123451" },

    { source: "123423", target: "123425" },
    { source: "123423", target: "123453" },

    { source: "123424", target: "123425" },
    { source: "123424", target: "123454" },

    { source: "123425", target: "123456" },
    { source: "123451", target: "123456" },
    { source: "123453", target: "123456" },
    { source: "123454", target: "123456" }
  ]
};