const MissionObjectivesBackdrop =
  () => (
    <div
      aria-hidden="true"
      className="mission-theme-decor"
    >
      <div className="mission-theme-rings" />
      <div className="mission-theme-dots mission-theme-dots--top" />
      <div className="mission-theme-dots mission-theme-dots--middle" />
      <span className="mission-theme-leaf mission-theme-leaf--one" />
      <span className="mission-theme-leaf mission-theme-leaf--two" />

      <svg
        className="mission-theme-wave mission-theme-wave--middle"
        viewBox="0 0 900 180"
        preserveAspectRatio="none"
      >
        <path d="M-20 118 C 130 18, 290 176, 445 82 S 720 28, 920 112" />
        <path d="M-20 132 C 135 34, 290 188, 455 96 S 730 42, 920 126" />
        <path d="M-20 146 C 142 50, 302 198, 470 110 S 744 58, 920 140" />
      </svg>

      <svg
        className="mission-theme-wave mission-theme-wave--lower"
        viewBox="0 0 900 180"
        preserveAspectRatio="none"
      >
        <path d="M-20 110 C 160 12, 300 176, 470 80 S 730 30, 920 106" />
        <path d="M-20 126 C 165 30, 310 190, 482 96 S 742 46, 920 122" />
      </svg>

      <svg
        className="mission-theme-landscape"
        viewBox="0 0 760 240"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="mission-hill-back"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0" stopColor="#BFE6DB" />
            <stop offset="1" stopColor="#78C7A1" />
          </linearGradient>
          <linearGradient
            id="mission-field-front"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0" stopColor="#DDF1C8" />
            <stop offset="1" stopColor="#8DCE7D" />
          </linearGradient>
        </defs>

        <path
          d="M90 171 C190 92 275 115 345 151 C440 78 555 92 760 151 L760 240 L90 240 Z"
          fill="url(#mission-hill-back)"
        />
        <path
          d="M0 205 C160 144 286 155 407 194 C520 156 645 151 760 174 L760 240 L0 240 Z"
          fill="#B6DFA0"
        />
        <path
          d="M0 222 C184 174 347 196 477 218 C579 188 672 184 760 197 L760 240 L0 240 Z"
          fill="url(#mission-field-front)"
        />
        <path
          d="M174 240 C292 197 392 198 510 225"
          fill="none"
          stroke="#6EBF82"
          strokeWidth="5"
          opacity="0.68"
        />
        <path
          d="M266 240 C371 209 490 207 604 230"
          fill="none"
          stroke="#F4FAE8"
          strokeWidth="6"
          opacity="0.8"
        />

        <g stroke="#69AFC0" strokeWidth="2" fill="none" opacity="0.78">
          <path d="M590 151 V70" />
          <circle cx="590" cy="70" r="4" fill="#69AFC0" />
          <path d="M590 70 L590 38 M590 70 L618 86 M590 70 L562 86" />
          <path d="M688 158 V91" />
          <circle cx="688" cy="91" r="3.5" fill="#69AFC0" />
          <path d="M688 91 L688 65 M688 91 L711 104 M688 91 L665 104" />
        </g>

        <g>
          <path d="M385 177 L421 148 L457 177 Z" fill="#E9A95C" />
          <rect x="392" y="176" width="58" height="37" rx="2" fill="#FFF4D6" />
          <rect x="416" y="188" width="13" height="25" fill="#6CA5B9" />
          <rect x="397" y="184" width="11" height="10" fill="#A8D7E3" />

          <path d="M470 184 L501 159 L533 184 Z" fill="#D98E52" />
          <rect x="477" y="183" width="50" height="33" rx="2" fill="#F9EBC3" />
          <rect x="496" y="194" width="12" height="22" fill="#5F9AAE" />

          <path d="M548 188 L576 166 L605 188 Z" fill="#E5A15A" />
          <rect x="554" y="187" width="45" height="30" rx="2" fill="#FFF5D8" />
          <rect x="571" y="197" width="11" height="20" fill="#6DA3B2" />
        </g>

        <g fill="#4EA66D">
          <rect x="350" y="178" width="5" height="34" rx="2" fill="#6E9C65" />
          <circle cx="353" cy="173" r="16" />
          <circle cx="343" cy="181" r="11" />
          <circle cx="364" cy="182" r="12" />

          <rect x="620" y="177" width="5" height="39" rx="2" fill="#6E9C65" />
          <circle cx="623" cy="171" r="18" />
          <circle cx="611" cy="180" r="12" />
          <circle cx="635" cy="181" r="13" />

          <rect x="706" y="183" width="4" height="31" rx="2" fill="#6E9C65" />
          <circle cx="708" cy="178" r="14" />
        </g>
      </svg>
    </div>
  );

export default MissionObjectivesBackdrop;
