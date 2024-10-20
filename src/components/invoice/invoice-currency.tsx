import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InvoiceCurrencyProps {
  onValueChange: (value: string) => void;
  value: string;
}

export function InvoiceCurrency({
  onValueChange,
  value,
}: InvoiceCurrencyProps) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger
        className='w-[180px] h-0 border-none outline-none underline'
        icon={false}
      >
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='AFN'>Afghan afghani</SelectItem>
        <SelectItem value='ALL'>Albanian lek</SelectItem>
        <SelectItem value='DZD'>Algerian dinar</SelectItem>
        <SelectItem value='AOA'>Angolan kwanza</SelectItem>
        <SelectItem value='ARS'>Argentine peso</SelectItem>
        <SelectItem value='AMD'>Armenian dram</SelectItem>
        <SelectItem value='AWG'>Aruban florin</SelectItem>
        <SelectItem value='AUD'>Australian dollar</SelectItem>
        <SelectItem value='AZN'>Azerbaijani manat</SelectItem>
        <SelectItem value='BHD'>Bahraini dinar</SelectItem>
        <SelectItem value='BSD'>Bahamian dollar</SelectItem>
        <SelectItem value='BDT'>Bangladeshi taka</SelectItem>
        <SelectItem value='BBD'>Barbadian dollar</SelectItem>
        <SelectItem value='BYN'>Belarusian ruble</SelectItem>
        <SelectItem value='BZD'>Belize dollar</SelectItem>
        <SelectItem value='BMD'>Bermudian dollar</SelectItem>
        <SelectItem value='BTN'>Bhutanese ngultrum</SelectItem>
        <SelectItem value='BOB'>Bolivian boliviano</SelectItem>
        <SelectItem value='BAM'>
          Bosnia and Herzegovina convertible mark
        </SelectItem>
        <SelectItem value='BWP'>Botswana pula</SelectItem>
        <SelectItem value='BRL'>Brazilian real</SelectItem>
        <SelectItem value='GBP'>British pound</SelectItem>
        <SelectItem value='BND'>Brunei dollar</SelectItem>
        <SelectItem value='MMK'>Burmese kyat</SelectItem>
        <SelectItem value='BIF'>Burundian franc</SelectItem>
        <SelectItem value='KHR'>Cambodian riel</SelectItem>
        <SelectItem value='CAD'>Canadian dollar</SelectItem>
        <SelectItem value='CVE'>Cape Verdean escudo</SelectItem>
        <SelectItem value='KYD'>Cayman Islands dollar</SelectItem>
        <SelectItem value='XAF'>Central African CFA franc</SelectItem>
        <SelectItem value='XPF'>CFP franc</SelectItem>
        <SelectItem value='CLP'>Chilean peso</SelectItem>
        <SelectItem value='CNY'>Chinese yuan</SelectItem>
        <SelectItem value='COP'>Colombian peso</SelectItem>
        <SelectItem value='KMF'>Comorian franc</SelectItem>
        <SelectItem value='CDF'>Congolese franc</SelectItem>
        <SelectItem value='CRC'>Costa Rican colón</SelectItem>
        <SelectItem value='HRK'>Croatian kuna</SelectItem>
        <SelectItem value='CUC'>Cuban convertible peso</SelectItem>
        <SelectItem value='CUP'>Cuban peso</SelectItem>
        <SelectItem value='CZK'>Czech koruna</SelectItem>
        <SelectItem value='DKK'>Danish krone</SelectItem>
        <SelectItem value='DOP'>Dominican peso</SelectItem>
        <SelectItem value='DJF'>Djiboutian franc</SelectItem>
        <SelectItem value='XCD'>Eastern Caribbean dollar</SelectItem>
        <SelectItem value='EGP'>Egyptian pound</SelectItem>
        <SelectItem value='ERN'>Eritrean nakfa</SelectItem>
        <SelectItem value='ETB'>Ethiopian birr</SelectItem>
        <SelectItem value='EUR'>Euro</SelectItem>
        <SelectItem value='FKP'>Falkland Islands pound</SelectItem>
        <SelectItem value='FJD'>Fijian dollar</SelectItem>
        <SelectItem value='GMD'>Gambian dalasi</SelectItem>
        <SelectItem value='GEL'>Georgian lari</SelectItem>
        <SelectItem value='GHS'>Ghanaian cedi</SelectItem>
        <SelectItem value='GIP'>Gibraltar pound</SelectItem>
        <SelectItem value='GTQ'>Guatemalan quetzal</SelectItem>
        <SelectItem value='GGP'>Guernsey pound</SelectItem>
        <SelectItem value='GNF'>Guinean franc</SelectItem>
        <SelectItem value='GYD'>Guyanese dollar</SelectItem>
        <SelectItem value='HTG'>Haitian gourde</SelectItem>
        <SelectItem value='HNL'>Honduran lempira</SelectItem>
        <SelectItem value='HKD'>Hong Kong dollar</SelectItem>
        <SelectItem value='HUF'>Hungarian forint</SelectItem>
        <SelectItem value='ISK'>Icelandic króna</SelectItem>
        <SelectItem value='INR'>Indian rupee</SelectItem>
        <SelectItem value='IDR'>Indonesian rupiah</SelectItem>
        <SelectItem value='IRR'>Iranian rial</SelectItem>
        <SelectItem value='IQD'>Iraqi dinar</SelectItem>
        <SelectItem value='ILS'>Israeli new shekel</SelectItem>
        <SelectItem value='JMD'>Jamaican dollar</SelectItem>
        <SelectItem value='JPY'>Japanese yen</SelectItem>
        <SelectItem value='JEP'>Jersey pound</SelectItem>
        <SelectItem value='JOD'>Jordanian dinar</SelectItem>
        <SelectItem value='KZT'>Kazakhstani tenge</SelectItem>
        <SelectItem value='KES'>Kenyan shilling</SelectItem>
        <SelectItem value='KID'>Kiribati dollar</SelectItem>
        <SelectItem value='KGS'>Kyrgyzstani som</SelectItem>
        <SelectItem value='KWD'>Kuwaiti dinar</SelectItem>
        <SelectItem value='LAK'>Lao kip</SelectItem>
        <SelectItem value='LBP'>Lebanese pound</SelectItem>
        <SelectItem value='LSL'>Lesotho loti</SelectItem>
        <SelectItem value='LRD'>Liberian dollar</SelectItem>
        <SelectItem value='LYD'>Libyan dinar</SelectItem>
        <SelectItem value='MOP'>Macanese pataca</SelectItem>
        <SelectItem value='MKD'>Macedonian denar</SelectItem>
        <SelectItem value='MGA'>Malagasy ariary</SelectItem>
        <SelectItem value='MWK'>Malawian kwacha</SelectItem>
        <SelectItem value='MYR'>Malaysian ringgit</SelectItem>
        <SelectItem value='MVR'>Maldivian rufiyaa</SelectItem>
        <SelectItem value='IMP'>Manx pound</SelectItem>
        <SelectItem value='MRU'>Mauritanian ouguiya</SelectItem>
        <SelectItem value='MUR'>Mauritian rupee</SelectItem>
        <SelectItem value='MXN'>Mexican peso</SelectItem>
        <SelectItem value='MDL'>Moldovan leu</SelectItem>
        <SelectItem value='MNT'>Mongolian tögrög</SelectItem>
        <SelectItem value='MAD'>Moroccan dirham</SelectItem>
        <SelectItem value='MZN'>Mozambican metical</SelectItem>
        <SelectItem value='NAD'>Namibian dollar</SelectItem>
        <SelectItem value='NPR'>Nepalese rupee</SelectItem>
        <SelectItem value='ANG'>Netherlands Antillean guilder</SelectItem>
        <SelectItem value='TWD'>New Taiwan dollar</SelectItem>
        <SelectItem value='NZD'>New Zealand dollar</SelectItem>
        <SelectItem value='NIO'>Nicaraguan córdoba</SelectItem>
        <SelectItem value='NGN'>Nigerian naira</SelectItem>
        <SelectItem value='KPW'>North Korean won</SelectItem>
        <SelectItem value='NOK'>Norwegian krone</SelectItem>
        <SelectItem value='OMR'>Omani rial</SelectItem>
        <SelectItem value='PKR'>Pakistani rupee</SelectItem>
        <SelectItem value='PAB'>Panamanian balboa</SelectItem>
        <SelectItem value='PGK'>Papua New Guinean kina</SelectItem>
        <SelectItem value='PYG'>Paraguayan guaraní</SelectItem>
        <SelectItem value='PEN'>Peruvian sol</SelectItem>
        <SelectItem value='PHP'>Philippine peso</SelectItem>
        <SelectItem value='PLN'>Polish złoty</SelectItem>
        <SelectItem value='QAR'>Qatari riyal</SelectItem>
        <SelectItem value='RON'>Romanian leu</SelectItem>
        <SelectItem value='RUB'>Russian ruble</SelectItem>
        <SelectItem value='RWF'>Rwandan franc</SelectItem>
        <SelectItem value='SHP'>Saint Helena pound</SelectItem>
        <SelectItem value='WST'>Samoan tālā</SelectItem>
        <SelectItem value='STN'>São Tomé and Príncipe dobra</SelectItem>
        <SelectItem value='SAR'>Saudi riyal</SelectItem>
        <SelectItem value='RSD'>Serbian dinar</SelectItem>
        <SelectItem value='SLL'>Sierra Leonean leone</SelectItem>
        <SelectItem value='SGD'>Singapore dollar</SelectItem>
        <SelectItem value='SOS'>Somali shilling</SelectItem>
        <SelectItem value='SLS'>Somaliland shilling</SelectItem>
        <SelectItem value='ZAR'>South African rand</SelectItem>
        <SelectItem value='KRW'>South Korean won</SelectItem>
        <SelectItem value='SSP'>South Sudanese pound</SelectItem>
        <SelectItem value='SRD'>Surinamese dollar</SelectItem>
        <SelectItem value='SEK'>Swedish krona</SelectItem>
        <SelectItem value='CHF'>Swiss franc</SelectItem>
        <SelectItem value='LKR'>Sri Lankan rupee</SelectItem>
        <SelectItem value='SZL'>Swazi lilangeni</SelectItem>
        <SelectItem value='SYP'>Syrian pound</SelectItem>
        <SelectItem value='TJS'>Tajikistani somoni</SelectItem>
        <SelectItem value='TZS'>Tanzanian shilling</SelectItem>
        <SelectItem value='THB'>Thai baht</SelectItem>
        <SelectItem value='TOP'>Tongan paʻanga</SelectItem>
        <SelectItem value='PRB'>Transnistrian ruble</SelectItem>
        <SelectItem value='TTD'>Trinidad and Tobago dollar</SelectItem>
        <SelectItem value='TND'>Tunisian dinar</SelectItem>
        <SelectItem value='TRY'>Turkish lira</SelectItem>
        <SelectItem value='TMT'>Turkmenistan manat</SelectItem>
        <SelectItem value='TVD'>Tuvaluan dollar</SelectItem>
        <SelectItem value='UGX'>Ugandan shilling</SelectItem>
        <SelectItem value='UAH'>Ukrainian hryvnia</SelectItem>
        <SelectItem value='AED'>United Arab Emirates dirham</SelectItem>
        <SelectItem value='USD'>United States dollar</SelectItem>
        <SelectItem value='UYU'>Uruguayan peso</SelectItem>
        <SelectItem value='UZS'>Uzbekistani soʻm</SelectItem>
        <SelectItem value='VUV'>Vanuatu vatu</SelectItem>
        <SelectItem value='VES'>Venezuelan bolívar soberano</SelectItem>
        <SelectItem value='VND'>Vietnamese đồng</SelectItem>
        <SelectItem value='XOF'>West African CFA franc</SelectItem>
        <SelectItem value='ZMW'>Zambian kwacha</SelectItem>
        <SelectItem value='ZWB'>Zimbabwean bonds</SelectItem>
      </SelectContent>
    </Select>
  );
}
