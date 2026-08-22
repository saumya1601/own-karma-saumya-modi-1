"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Act05RealizationProps {
  /** Callback fired when the emblem ritual completes and hands off to Act VI. */
  onComplete?: () => void;
  /** Callback fired when visitor scrolls backward. */
  onBack?: () => void;
  /** Initial progress (0 for top, 1 for bottom when entering backward). */
  initialProgress?: number;
}

// Logo Vector Paths accurately matching Own Karma brand identity
const EMBLEM_PATHS = ["M 582,166 L 581,167 L 577,167 L 576,168 L 573,168 L 572,169 L 567,170 L 566,171 L 555,176 L 552,179 L 551,179 L 539,191 L 539,192 L 536,195 L 535,198 L 533,200 L 533,201 L 531,204 L 531,206 L 529,209 L 529,211 L 528,212 L 528,215 L 527,216 L 527,220 L 526,221 L 526,242 L 527,243 L 527,247 L 528,248 L 528,250 L 529,251 L 530,256 L 532,259 L 532,261 L 534,263 L 535,266 L 537,268 L 537,269 L 539,271 L 539,272 L 551,284 L 552,284 L 557,288 L 558,288 L 567,293 L 569,293 L 570,294 L 572,294 L 573,295 L 576,295 L 577,296 L 582,296 L 583,297 L 600,297 L 601,296 L 605,296 L 606,295 L 613,294 L 616,292 L 618,292 L 619,291 L 624,289 L 626,287 L 627,287 L 629,285 L 630,285 L 633,282 L 634,282 L 642,274 L 642,273 L 645,270 L 645,269 L 649,264 L 649,263 L 652,258 L 652,256 L 653,255 L 653,253 L 654,252 L 654,250 L 655,249 L 655,246 L 656,245 L 656,240 L 657,239 L 657,224 L 656,223 L 656,218 L 655,217 L 655,214 L 654,213 L 654,211 L 653,210 L 652,205 L 651,204 L 649,199 L 647,197 L 646,194 L 643,191 L 643,190 L 633,180 L 632,180 L 626,175 L 625,175 L 616,170 L 614,170 L 613,169 L 611,169 L 610,168 L 607,168 L 606,167 L 602,167 L 601,166 Z", "M 572,322 L 572,428 L 578,434 L 579,434 L 592,447 L 593,447 L 595,445 L 595,444 L 608,431 L 608,430 L 611,427 L 611,322 L 610,322 L 609,323 L 607,323 L 606,324 L 605,324 L 604,325 L 603,325 L 602,326 L 601,326 L 598,328 L 596,328 L 595,329 L 588,329 L 587,328 L 585,328 L 584,327 L 583,327 L 582,326 L 581,326 L 580,325 L 579,325 L 576,323 L 574,323 L 573,322 Z", "M 251,145 L 440,243 L 440,444 L 545,472 L 544,433 L 479,414 L 479,215 L 389,190 Z", "M 931,145 L 790,191 L 704,214 L 704,414 L 639,433 L 638,472 L 743,444 L 743,243 Z", "M 376,443 L 376,482 L 377,483 L 377,484 L 378,484 L 381,487 L 382,487 L 383,488 L 384,488 L 386,490 L 387,490 L 388,491 L 389,491 L 390,492 L 391,492 L 392,493 L 393,493 L 394,494 L 395,494 L 396,495 L 397,495 L 398,496 L 399,496 L 400,497 L 402,497 L 403,498 L 404,498 L 405,499 L 406,499 L 407,500 L 409,500 L 410,501 L 412,501 L 413,502 L 414,502 L 414,462 L 412,460 L 411,460 L 410,459 L 409,459 L 408,458 L 407,458 L 406,457 L 405,457 L 404,456 L 403,456 L 402,455 L 401,455 L 400,454 L 399,454 L 398,453 L 397,453 L 396,452 L 395,452 L 394,451 L 393,451 L 392,450 L 391,450 L 390,449 L 389,449 L 388,448 L 387,448 L 386,447 L 384,447 L 383,446 L 382,446 L 381,445 L 380,445 L 379,444 L 377,444 Z", "M 446,480 L 446,521 L 736,662 L 737,621 L 676,591 L 674,591 L 631,569 L 629,569 L 586,547 L 584,547 L 541,525 L 539,525 L 496,503 L 494,503 L 451,481 Z", "M 377,523 L 377,572 L 376,573 L 376,696 L 380,695 L 387,691 L 389,691 L 406,682 L 408,682 L 513,629 L 515,629 L 538,617 L 540,617 L 547,613 L 553,611 L 553,610 L 549,607 L 530,598 L 523,596 L 513,591 L 506,591 L 465,612 L 463,612 L 444,622 L 442,622 L 421,633 L 415,635 L 414,634 L 414,541 Z", "M 807,446 L 803,447 L 757,470 L 755,470 L 732,482 L 730,482 L 671,512 L 669,512 L 660,517 L 658,517 L 634,529 L 630,532 L 638,537 L 652,542 L 669,550 L 679,550 L 738,519 L 740,519 L 751,513 L 753,513 L 768,506 L 769,507 L 769,596 L 806,614 L 806,578 L 807,577 Z", "M 769,639 L 769,681 L 770,682 L 771,682 L 772,683 L 773,683 L 774,684 L 776,684 L 777,685 L 778,685 L 779,686 L 780,686 L 781,687 L 782,687 L 783,688 L 784,688 L 785,689 L 786,689 L 787,690 L 788,690 L 789,691 L 791,691 L 792,692 L 793,692 L 794,693 L 795,693 L 796,694 L 797,694 L 798,695 L 799,695 L 800,696 L 801,696 L 802,697 L 803,697 L 804,698 L 806,698 L 806,675 L 807,674 L 807,657 L 806,657 L 805,656 L 804,656 L 803,655 L 802,655 L 801,654 L 800,654 L 799,653 L 798,653 L 797,652 L 796,652 L 795,651 L 794,651 L 793,650 L 792,650 L 791,649 L 790,649 L 789,648 L 788,648 L 787,647 L 786,647 L 785,646 L 784,646 L 783,645 L 781,645 L 780,644 L 779,644 L 778,643 L 777,643 L 776,642 L 775,642 L 774,641 L 773,641 L 772,640 L 771,640 L 770,639 Z"];

const LETTER_PATHS = ["M 115,828 L 114,829 L 110,829 L 109,830 L 106,830 L 103,832 L 101,832 L 100,833 L 99,833 L 97,835 L 96,835 L 94,837 L 93,837 L 89,841 L 88,841 L 87,842 L 87,843 L 83,847 L 83,848 L 81,850 L 81,851 L 80,852 L 80,853 L 79,854 L 79,855 L 77,858 L 77,860 L 76,861 L 76,863 L 75,864 L 75,868 L 74,869 L 74,882 L 75,883 L 75,887 L 76,888 L 76,891 L 78,894 L 78,896 L 79,897 L 80,900 L 82,902 L 82,903 L 85,906 L 85,907 L 91,913 L 92,913 L 97,917 L 98,917 L 99,918 L 100,918 L 103,920 L 105,920 L 106,921 L 108,921 L 109,922 L 112,922 L 113,923 L 130,923 L 131,922 L 134,922 L 135,921 L 138,921 L 139,920 L 140,920 L 141,919 L 142,919 L 143,918 L 144,918 L 145,917 L 148,916 L 151,913 L 152,913 L 160,905 L 160,904 L 162,902 L 162,901 L 163,900 L 163,899 L 164,898 L 164,897 L 165,896 L 165,895 L 167,892 L 167,890 L 168,889 L 168,885 L 169,884 L 169,867 L 168,866 L 168,863 L 167,862 L 167,860 L 166,859 L 166,857 L 165,856 L 165,855 L 164,854 L 163,851 L 161,849 L 161,848 L 158,845 L 158,844 L 153,839 L 152,839 L 149,836 L 148,836 L 146,834 L 145,834 L 142,832 L 140,832 L 137,830 L 134,830 L 133,829 L 129,829 L 128,828 Z M 121,847 L 122,847 L 123,848 L 128,848 L 129,849 L 131,849 L 132,850 L 133,850 L 134,851 L 135,851 L 137,853 L 138,853 L 144,859 L 144,860 L 146,862 L 146,863 L 147,864 L 147,865 L 148,866 L 148,868 L 149,869 L 149,882 L 148,883 L 148,885 L 147,886 L 147,887 L 146,888 L 146,889 L 145,890 L 145,891 L 137,899 L 136,899 L 134,901 L 133,901 L 132,902 L 130,902 L 129,903 L 126,903 L 125,904 L 118,904 L 117,903 L 114,903 L 113,902 L 111,902 L 110,901 L 109,901 L 107,899 L 106,899 L 98,891 L 98,890 L 97,889 L 97,888 L 96,887 L 96,886 L 95,885 L 95,883 L 94,882 L 94,869 L 95,868 L 95,866 L 96,865 L 96,864 L 97,863 L 97,862 L 99,860 L 99,859 L 105,853 L 106,853 L 108,851 L 109,851 L 110,850 L 111,850 L 112,849 L 114,849 L 115,848 L 120,848 Z", "M 197,830 L 201,849 L 203,853 L 205,864 L 207,868 L 210,883 L 212,887 L 214,898 L 216,902 L 216,905 L 221,922 L 242,922 L 242,919 L 245,910 L 245,906 L 257,861 L 258,862 L 272,921 L 273,922 L 293,922 L 297,905 L 299,901 L 300,894 L 302,890 L 304,879 L 306,875 L 307,868 L 309,864 L 311,853 L 313,849 L 314,842 L 318,830 L 298,830 L 297,831 L 297,835 L 292,854 L 287,882 L 285,887 L 285,891 L 283,894 L 282,893 L 267,830 L 248,830 L 247,831 L 234,885 L 231,893 L 229,891 L 229,887 L 228,886 L 228,882 L 227,881 L 227,877 L 223,862 L 223,858 L 222,857 L 222,853 L 221,852 L 217,830 Z", "M 349,830 L 349,922 L 367,922 L 367,862 L 368,861 L 371,864 L 373,868 L 382,879 L 384,883 L 393,894 L 395,898 L 398,901 L 398,902 L 401,905 L 401,906 L 404,909 L 406,913 L 413,922 L 431,922 L 431,830 L 413,830 L 413,884 L 412,885 L 373,830 Z", "M 506,830 L 506,922 L 527,922 L 527,913 L 539,897 L 561,920 L 562,922 L 591,922 L 585,916 L 585,915 L 570,900 L 570,899 L 555,884 L 554,882 L 557,878 L 558,875 L 560,873 L 560,872 L 562,870 L 562,869 L 564,867 L 564,866 L 566,864 L 566,863 L 568,861 L 568,860 L 570,858 L 570,857 L 572,855 L 572,854 L 574,852 L 574,851 L 576,849 L 576,848 L 588,831 L 588,830 L 563,830 L 561,832 L 559,836 L 556,839 L 556,840 L 554,842 L 554,843 L 552,845 L 552,846 L 550,848 L 548,852 L 545,855 L 545,856 L 543,858 L 543,859 L 541,861 L 539,865 L 536,868 L 536,869 L 528,880 L 527,879 L 527,830 Z", "M 660,830 L 658,833 L 658,835 L 657,836 L 657,837 L 656,838 L 656,839 L 653,844 L 653,846 L 652,847 L 652,848 L 651,849 L 651,850 L 648,855 L 648,857 L 647,858 L 647,859 L 646,860 L 646,861 L 643,866 L 643,868 L 642,869 L 642,870 L 641,871 L 641,872 L 638,877 L 638,879 L 637,880 L 637,881 L 636,882 L 636,883 L 633,888 L 633,890 L 632,891 L 632,892 L 631,893 L 631,894 L 628,899 L 628,901 L 627,902 L 627,903 L 626,904 L 626,905 L 623,910 L 623,912 L 622,913 L 622,914 L 621,915 L 621,916 L 620,917 L 620,918 L 619,919 L 618,922 L 637,922 L 637,921 L 638,920 L 638,919 L 639,918 L 639,917 L 640,916 L 640,915 L 641,914 L 641,913 L 644,908 L 644,906 L 645,905 L 645,904 L 647,902 L 692,902 L 694,904 L 694,905 L 695,906 L 695,908 L 696,909 L 696,910 L 699,915 L 699,917 L 702,922 L 721,922 L 721,920 L 718,915 L 718,913 L 717,912 L 717,911 L 714,906 L 714,904 L 713,903 L 713,902 L 710,897 L 710,895 L 709,894 L 709,893 L 706,888 L 706,886 L 705,885 L 705,884 L 704,883 L 704,882 L 701,877 L 701,875 L 700,874 L 700,873 L 697,868 L 697,866 L 696,865 L 696,864 L 693,859 L 693,857 L 692,856 L 692,855 L 689,850 L 689,848 L 688,847 L 688,846 L 685,841 L 685,839 L 684,838 L 684,837 L 683,836 L 683,835 L 682,834 L 681,831 L 680,830 Z M 670,849 L 672,851 L 672,852 L 673,853 L 673,854 L 674,855 L 674,857 L 675,858 L 675,859 L 676,860 L 676,862 L 677,863 L 677,864 L 678,865 L 678,866 L 679,867 L 679,869 L 680,870 L 680,871 L 681,872 L 681,873 L 682,874 L 682,876 L 683,877 L 683,878 L 684,879 L 684,881 L 685,882 L 684,883 L 657,883 L 656,882 L 656,880 L 657,879 L 657,878 L 658,877 L 658,876 L 659,875 L 659,873 L 660,872 L 660,871 L 661,870 L 661,869 L 662,868 L 662,866 L 663,865 L 663,864 L 664,863 L 664,862 L 665,861 L 665,860 L 666,859 L 666,857 L 667,856 L 667,855 L 668,854 L 668,853 L 669,852 L 669,850 Z", "M 755,830 L 755,922 L 775,922 L 775,890 L 776,889 L 785,889 L 786,890 L 786,891 L 789,894 L 789,895 L 791,897 L 791,898 L 793,900 L 793,901 L 796,904 L 796,905 L 801,911 L 801,912 L 803,914 L 803,915 L 805,917 L 805,918 L 808,921 L 808,922 L 833,922 L 833,921 L 831,919 L 831,918 L 828,915 L 828,914 L 825,911 L 825,910 L 822,907 L 822,906 L 818,902 L 818,901 L 815,898 L 815,897 L 809,890 L 809,888 L 810,887 L 812,887 L 813,886 L 816,885 L 818,883 L 819,883 L 823,879 L 823,878 L 825,876 L 825,875 L 827,872 L 827,870 L 828,869 L 828,865 L 829,864 L 829,856 L 828,855 L 828,850 L 827,849 L 827,847 L 826,846 L 825,843 L 822,840 L 822,839 L 820,837 L 819,837 L 814,833 L 812,833 L 811,832 L 809,832 L 808,831 L 804,831 L 803,830 Z M 775,847 L 776,846 L 798,846 L 799,847 L 801,847 L 802,848 L 803,848 L 808,853 L 808,855 L 809,856 L 809,863 L 808,864 L 808,866 L 806,868 L 806,869 L 805,870 L 804,870 L 802,872 L 800,872 L 799,873 L 793,873 L 792,874 L 776,874 L 775,873 Z", "M 875,830 L 875,922 L 894,922 L 894,862 L 895,861 L 914,899 L 930,899 L 950,859 L 951,860 L 951,922 L 970,922 L 970,830 L 943,830 L 924,867 L 922,869 L 920,867 L 912,850 L 910,848 L 901,830 Z", "M 1046,830 L 1046,831 L 1044,834 L 1044,836 L 1043,837 L 1043,838 L 1042,839 L 1042,840 L 1039,845 L 1039,847 L 1038,848 L 1038,849 L 1035,854 L 1035,856 L 1034,857 L 1034,858 L 1033,859 L 1033,860 L 1030,865 L 1030,867 L 1029,868 L 1029,869 L 1028,870 L 1028,871 L 1025,876 L 1025,878 L 1024,879 L 1024,880 L 1023,881 L 1023,882 L 1020,887 L 1020,889 L 1019,890 L 1019,891 L 1018,892 L 1018,893 L 1015,898 L 1015,900 L 1014,901 L 1014,902 L 1013,903 L 1013,904 L 1010,909 L 1010,911 L 1009,912 L 1009,913 L 1008,914 L 1008,915 L 1005,920 L 1005,922 L 1023,922 L 1024,921 L 1024,920 L 1025,919 L 1025,918 L 1026,917 L 1026,916 L 1027,915 L 1027,914 L 1030,909 L 1030,907 L 1033,902 L 1079,902 L 1081,905 L 1081,907 L 1082,908 L 1082,909 L 1085,914 L 1085,916 L 1086,917 L 1086,918 L 1087,919 L 1088,922 L 1108,922 L 1108,921 L 1105,916 L 1105,914 L 1104,913 L 1104,912 L 1101,907 L 1101,905 L 1100,904 L 1100,903 L 1099,902 L 1099,901 L 1096,896 L 1096,894 L 1095,893 L 1095,892 L 1092,887 L 1092,885 L 1091,884 L 1091,883 L 1088,878 L 1088,876 L 1087,875 L 1087,874 L 1084,869 L 1084,867 L 1083,866 L 1083,865 L 1080,860 L 1080,858 L 1079,857 L 1079,856 L 1078,855 L 1078,854 L 1075,849 L 1075,847 L 1074,846 L 1074,845 L 1071,840 L 1071,838 L 1070,837 L 1070,836 L 1069,835 L 1069,834 L 1068,833 L 1067,830 Z M 1057,848 L 1058,849 L 1058,851 L 1059,852 L 1059,853 L 1060,854 L 1060,856 L 1061,857 L 1061,858 L 1062,859 L 1062,860 L 1063,861 L 1063,863 L 1064,864 L 1064,865 L 1065,866 L 1065,867 L 1066,868 L 1066,870 L 1067,871 L 1067,872 L 1068,873 L 1068,875 L 1069,876 L 1069,877 L 1070,878 L 1070,879 L 1071,880 L 1071,882 L 1070,883 L 1043,883 L 1042,882 L 1042,881 L 1043,880 L 1043,879 L 1044,878 L 1044,877 L 1045,876 L 1045,875 L 1046,874 L 1046,872 L 1047,871 L 1047,870 L 1048,869 L 1048,868 L 1049,867 L 1049,865 L 1050,864 L 1050,863 L 1051,862 L 1051,861 L 1052,860 L 1052,858 L 1053,857 L 1053,856 L 1054,855 L 1054,854 L 1055,853 L 1055,852 L 1056,851 L 1056,849 Z"];

const RULE_LEFT_PATH = "M 74,1010 L 74,1014 L 75,1015 L 214,1015 L 215,1014 L 215,1010 L 214,1009 L 75,1009 Z";
const RULE_RIGHT_PATH = "M 966,1011 L 966,1013 L 968,1015 L 1106,1015 L 1108,1013 L 1108,1010 L 1107,1009 L 968,1009 Z";
const TAGLINE_PATHS = ["M 247,988 L 247,1025 L 268,1025 L 269,1024 L 270,1024 L 271,1023 L 272,1023 L 272,1022 L 274,1020 L 274,1019 L 275,1018 L 275,1012 L 274,1011 L 274,1010 L 273,1009 L 273,1008 L 272,1007 L 271,1007 L 270,1006 L 270,1005 L 272,1003 L 272,1002 L 273,1001 L 273,994 L 271,992 L 271,991 L 270,991 L 268,989 L 265,989 L 264,988 Z M 252,1009 L 253,1008 L 264,1008 L 265,1009 L 266,1009 L 267,1010 L 268,1010 L 269,1011 L 269,1012 L 270,1013 L 270,1016 L 269,1017 L 269,1018 L 267,1020 L 266,1020 L 265,1021 L 253,1021 L 252,1020 Z M 252,994 L 253,993 L 265,993 L 268,996 L 268,1001 L 266,1003 L 264,1003 L 263,1004 L 253,1004 L 252,1003 Z", "M 288,998 L 287,999 L 286,999 L 285,1000 L 284,1000 L 282,1002 L 282,1003 L 281,1004 L 281,1005 L 280,1006 L 280,1018 L 281,1019 L 281,1020 L 283,1022 L 283,1023 L 284,1023 L 286,1025 L 288,1025 L 289,1026 L 296,1026 L 297,1025 L 298,1025 L 299,1024 L 300,1024 L 303,1021 L 303,1020 L 304,1019 L 304,1017 L 299,1017 L 299,1018 L 296,1021 L 295,1021 L 294,1022 L 290,1022 L 288,1020 L 287,1020 L 286,1019 L 286,1018 L 285,1017 L 285,1015 L 284,1014 L 285,1013 L 304,1013 L 304,1006 L 303,1005 L 303,1004 L 302,1003 L 302,1002 L 300,1000 L 299,1000 L 298,999 L 297,999 L 296,998 Z M 285,1007 L 286,1006 L 286,1005 L 289,1002 L 295,1002 L 299,1006 L 299,1008 L 298,1009 L 286,1009 L 285,1008 Z", "M 332,999 L 327,999 L 327,1000 L 326,1001 L 326,1002 L 325,1003 L 325,1005 L 324,1006 L 324,1008 L 323,1009 L 323,1011 L 322,1012 L 322,1013 L 321,1014 L 321,1016 L 320,1017 L 318,1015 L 318,1014 L 317,1013 L 317,1011 L 316,1010 L 316,1008 L 315,1007 L 315,1005 L 314,1004 L 314,1002 L 313,1001 L 313,1000 L 312,999 L 307,999 L 308,1000 L 308,1002 L 309,1003 L 309,1004 L 310,1005 L 310,1007 L 311,1008 L 311,1010 L 312,1011 L 312,1012 L 313,1013 L 313,1015 L 314,1016 L 314,1018 L 315,1019 L 315,1020 L 316,1021 L 316,1023 L 317,1024 L 317,1027 L 316,1028 L 316,1029 L 313,1032 L 311,1032 L 310,1031 L 309,1031 L 309,1034 L 310,1035 L 310,1036 L 315,1036 L 316,1035 L 317,1035 L 319,1033 L 319,1032 L 320,1031 L 320,1030 L 321,1029 L 321,1027 L 322,1026 L 322,1024 L 323,1023 L 323,1022 L 324,1021 L 324,1019 L 325,1018 L 325,1016 L 326,1015 L 326,1014 L 327,1013 L 327,1011 L 328,1010 L 328,1008 L 329,1007 L 329,1005 L 330,1004 L 330,1003 L 331,1002 L 331,1000 Z", "M 343,998 L 342,999 L 340,999 L 335,1004 L 335,1006 L 334,1007 L 334,1017 L 335,1018 L 335,1019 L 336,1020 L 336,1021 L 339,1024 L 340,1024 L 341,1025 L 342,1025 L 343,1026 L 349,1026 L 350,1025 L 352,1025 L 353,1024 L 354,1024 L 357,1021 L 357,1020 L 358,1019 L 358,1017 L 359,1016 L 359,1007 L 358,1006 L 358,1004 L 353,999 L 351,999 L 350,998 Z M 344,1002 L 349,1002 L 354,1007 L 354,1016 L 353,1017 L 353,1018 L 349,1022 L 344,1022 L 340,1018 L 340,1017 L 339,1016 L 339,1007 L 341,1005 L 341,1004 L 342,1003 L 343,1003 Z", "M 364,999 L 364,1025 L 369,1025 L 369,1007 L 370,1006 L 370,1005 L 372,1003 L 373,1003 L 374,1002 L 378,1002 L 381,1005 L 381,1008 L 382,1009 L 382,1025 L 386,1025 L 386,1003 L 385,1002 L 385,1001 L 383,999 L 381,999 L 380,998 L 373,998 L 372,999 L 371,999 L 369,1001 L 368,1000 L 368,999 Z", "M 415,988 L 410,988 L 410,999 L 409,1000 L 408,999 L 407,999 L 406,998 L 399,998 L 398,999 L 397,999 L 393,1003 L 393,1004 L 392,1005 L 392,1008 L 391,1009 L 391,1014 L 392,1015 L 392,1018 L 393,1019 L 393,1020 L 394,1021 L 394,1022 L 396,1024 L 397,1024 L 398,1025 L 399,1025 L 400,1026 L 405,1026 L 406,1025 L 408,1025 L 409,1024 L 410,1025 L 415,1025 Z M 401,1002 L 405,1002 L 406,1003 L 407,1003 L 409,1005 L 409,1006 L 410,1007 L 410,1017 L 409,1018 L 409,1019 L 407,1021 L 406,1021 L 405,1022 L 401,1022 L 397,1018 L 397,1016 L 396,1015 L 396,1008 L 397,1007 L 397,1006 Z", "M 462,988 L 437,988 L 437,1025 L 442,1025 L 442,1009 L 443,1008 L 459,1008 L 459,1004 L 443,1004 L 442,1003 L 442,994 L 443,993 L 462,993 Z", "M 471,999 L 468,1002 L 468,1003 L 467,1004 L 467,1006 L 468,1006 L 469,1007 L 471,1007 L 472,1006 L 472,1005 L 475,1002 L 481,1002 L 482,1003 L 483,1003 L 484,1004 L 484,1005 L 485,1006 L 485,1007 L 483,1009 L 479,1009 L 478,1010 L 473,1010 L 472,1011 L 470,1011 L 467,1014 L 467,1015 L 466,1016 L 466,1021 L 467,1022 L 467,1023 L 468,1024 L 469,1024 L 470,1025 L 471,1025 L 472,1026 L 478,1026 L 479,1025 L 481,1025 L 482,1024 L 483,1024 L 484,1023 L 486,1025 L 491,1025 L 490,1024 L 490,1022 L 489,1021 L 489,1002 L 486,999 L 485,999 L 484,998 L 474,998 L 473,999 Z M 485,1013 L 485,1015 L 484,1016 L 484,1018 L 481,1021 L 480,1021 L 479,1022 L 474,1022 L 471,1019 L 471,1017 L 474,1014 L 477,1014 L 478,1013 L 483,1013 L 484,1012 Z", "M 501,998 L 500,999 L 499,999 L 498,1000 L 497,1000 L 497,1001 L 496,1002 L 496,1003 L 495,1004 L 495,1007 L 496,1008 L 496,1010 L 497,1011 L 498,1011 L 499,1012 L 500,1012 L 501,1013 L 504,1013 L 505,1014 L 507,1014 L 508,1015 L 510,1015 L 512,1017 L 512,1019 L 509,1022 L 503,1022 L 499,1018 L 499,1017 L 494,1017 L 495,1018 L 495,1021 L 499,1025 L 501,1025 L 502,1026 L 509,1026 L 510,1025 L 512,1025 L 513,1024 L 514,1024 L 515,1023 L 515,1022 L 516,1021 L 516,1020 L 517,1019 L 517,1016 L 516,1015 L 516,1013 L 515,1012 L 514,1012 L 513,1011 L 512,1011 L 511,1010 L 508,1010 L 507,1009 L 505,1009 L 504,1008 L 502,1008 L 500,1006 L 500,1004 L 502,1002 L 508,1002 L 511,1005 L 511,1006 L 515,1006 L 516,1005 L 515,1004 L 515,1002 L 512,999 L 510,999 L 509,998 Z", "M 522,988 L 522,1025 L 527,1025 L 527,1006 L 530,1003 L 531,1003 L 532,1002 L 536,1002 L 539,1005 L 539,1025 L 544,1025 L 544,1005 L 543,1004 L 543,1002 L 542,1001 L 542,1000 L 541,1000 L 540,999 L 539,999 L 538,998 L 531,998 L 530,999 L 529,999 L 528,1000 L 527,999 L 527,988 Z", "M 551,999 L 551,1025 L 555,1025 L 555,999 Z", "M 551,988 L 551,993 L 555,993 L 555,988 Z", "M 569,998 L 568,999 L 567,999 L 566,1000 L 565,1000 L 563,1002 L 563,1003 L 562,1004 L 562,1005 L 561,1006 L 561,1018 L 562,1019 L 562,1020 L 563,1021 L 563,1022 L 565,1024 L 566,1024 L 567,1025 L 569,1025 L 570,1026 L 576,1026 L 577,1025 L 579,1025 L 580,1024 L 581,1024 L 583,1022 L 583,1021 L 584,1020 L 584,1019 L 585,1018 L 585,1014 L 586,1013 L 586,1010 L 585,1009 L 585,1005 L 584,1004 L 584,1003 L 581,1000 L 580,1000 L 579,999 L 578,999 L 577,998 Z M 571,1002 L 576,1002 L 580,1006 L 580,1008 L 581,1009 L 581,1015 L 580,1016 L 580,1017 L 579,1018 L 579,1019 L 577,1021 L 576,1021 L 575,1022 L 571,1022 L 570,1021 L 569,1021 L 567,1019 L 567,1018 L 566,1017 L 566,1016 L 565,1015 L 565,1009 L 566,1008 L 566,1006 L 569,1003 L 570,1003 Z", "M 591,999 L 591,1025 L 595,1025 L 595,1010 L 596,1009 L 596,1006 L 600,1002 L 604,1002 L 605,1003 L 606,1003 L 607,1004 L 607,1005 L 608,1006 L 608,1025 L 613,1025 L 613,1006 L 612,1005 L 612,1002 L 609,999 L 608,999 L 607,998 L 600,998 L 599,999 L 598,999 L 596,1001 L 595,1000 L 595,999 Z", "M 621,1020 L 621,1025 L 626,1025 L 626,1020 Z", "M 649,988 L 649,1025 L 669,1025 L 670,1024 L 672,1024 L 675,1021 L 675,1020 L 676,1019 L 676,1016 L 677,1015 L 677,1014 L 676,1013 L 676,1010 L 671,1005 L 674,1002 L 674,1000 L 675,999 L 675,996 L 674,995 L 674,993 L 671,990 L 670,990 L 669,989 L 666,989 L 665,988 Z M 654,1009 L 655,1008 L 665,1008 L 666,1009 L 668,1009 L 671,1012 L 671,1017 L 668,1020 L 667,1020 L 666,1021 L 655,1021 L 654,1020 Z M 654,994 L 655,993 L 666,993 L 667,994 L 668,994 L 669,995 L 669,996 L 670,997 L 670,1000 L 667,1003 L 666,1003 L 665,1004 L 655,1004 L 654,1003 Z", "M 690,998 L 689,999 L 687,999 L 683,1003 L 683,1004 L 682,1005 L 682,1007 L 681,1008 L 681,1016 L 682,1017 L 682,1019 L 683,1020 L 683,1021 L 686,1024 L 687,1024 L 688,1025 L 690,1025 L 691,1026 L 697,1026 L 698,1025 L 700,1025 L 701,1024 L 702,1024 L 704,1022 L 704,1021 L 705,1020 L 705,1018 L 706,1017 L 701,1017 L 699,1019 L 699,1020 L 698,1021 L 697,1021 L 696,1022 L 692,1022 L 691,1021 L 690,1021 L 687,1018 L 687,1017 L 686,1016 L 686,1014 L 687,1013 L 706,1013 L 706,1009 L 705,1008 L 705,1005 L 704,1004 L 704,1003 L 700,999 L 698,999 L 697,998 Z M 686,1008 L 687,1007 L 687,1006 L 691,1002 L 696,1002 L 697,1003 L 698,1003 L 699,1004 L 699,1005 L 700,1006 L 700,1007 L 701,1008 L 700,1009 L 687,1009 Z", "M 733,999 L 728,999 L 728,1001 L 727,1002 L 727,1004 L 726,1005 L 726,1006 L 725,1007 L 725,1009 L 724,1010 L 724,1012 L 723,1013 L 723,1015 L 722,1016 L 722,1017 L 721,1018 L 720,1017 L 720,1015 L 719,1014 L 719,1012 L 718,1011 L 718,1009 L 717,1008 L 717,1007 L 716,1006 L 716,1004 L 715,1003 L 715,1001 L 714,1000 L 714,999 L 709,999 L 709,1000 L 710,1001 L 710,1003 L 711,1004 L 711,1006 L 712,1007 L 712,1008 L 713,1009 L 713,1011 L 714,1012 L 714,1014 L 715,1015 L 715,1016 L 716,1017 L 716,1019 L 717,1020 L 717,1021 L 718,1022 L 718,1024 L 719,1025 L 719,1026 L 718,1027 L 718,1028 L 717,1029 L 717,1030 L 716,1031 L 715,1031 L 714,1032 L 712,1032 L 711,1031 L 711,1036 L 717,1036 L 721,1032 L 721,1031 L 722,1030 L 722,1028 L 723,1027 L 723,1026 L 724,1025 L 724,1023 L 725,1022 L 725,1020 L 726,1019 L 726,1018 L 727,1017 L 727,1015 L 728,1014 L 728,1012 L 729,1011 L 729,1010 L 730,1009 L 730,1007 L 731,1006 L 731,1004 L 732,1003 L 732,1001 L 733,1000 Z", "M 744,998 L 743,999 L 742,999 L 741,1000 L 740,1000 L 737,1003 L 737,1004 L 736,1005 L 736,1010 L 735,1011 L 735,1013 L 736,1014 L 736,1018 L 737,1019 L 737,1020 L 738,1021 L 738,1022 L 740,1024 L 741,1024 L 742,1025 L 744,1025 L 745,1026 L 751,1026 L 752,1025 L 754,1025 L 756,1023 L 757,1023 L 758,1022 L 758,1021 L 759,1020 L 759,1019 L 760,1018 L 760,1013 L 761,1012 L 761,1011 L 760,1010 L 760,1006 L 759,1005 L 759,1004 L 758,1003 L 758,1002 L 756,1000 L 755,1000 L 754,999 L 753,999 L 752,998 Z M 745,1002 L 750,1002 L 751,1003 L 752,1003 L 755,1006 L 755,1008 L 756,1009 L 756,1015 L 755,1016 L 755,1017 L 754,1018 L 754,1019 L 752,1021 L 751,1021 L 750,1022 L 746,1022 L 745,1021 L 744,1021 L 742,1019 L 742,1018 L 741,1017 L 741,1016 L 740,1015 L 740,1009 L 741,1008 L 741,1006 Z", "M 766,999 L 766,1025 L 770,1025 L 770,1009 L 771,1008 L 771,1006 L 775,1002 L 779,1002 L 780,1003 L 781,1003 L 782,1004 L 782,1005 L 783,1006 L 783,1025 L 788,1025 L 788,1007 L 787,1006 L 787,1002 L 784,999 L 783,999 L 782,998 L 775,998 L 774,999 L 773,999 L 772,1000 L 771,1000 L 770,999 Z", "M 816,988 L 812,988 L 812,1000 L 811,1001 L 809,999 L 808,999 L 807,998 L 801,998 L 800,999 L 799,999 L 798,1000 L 797,1000 L 795,1002 L 795,1003 L 794,1004 L 794,1006 L 793,1007 L 793,1017 L 794,1018 L 794,1019 L 795,1020 L 795,1021 L 799,1025 L 801,1025 L 802,1026 L 807,1026 L 808,1025 L 809,1025 L 811,1023 L 812,1024 L 812,1025 L 816,1025 Z M 802,1002 L 807,1002 L 811,1006 L 811,1008 L 812,1009 L 812,1015 L 811,1016 L 811,1018 L 807,1022 L 803,1022 L 798,1017 L 798,1013 L 797,1012 L 797,1011 L 798,1010 L 798,1007 L 799,1006 L 799,1005 Z", "M 846,988 L 845,989 L 843,989 L 841,991 L 840,991 L 840,992 L 839,993 L 839,994 L 838,995 L 838,1001 L 839,1002 L 839,1003 L 842,1006 L 843,1006 L 844,1007 L 847,1007 L 848,1008 L 850,1008 L 851,1009 L 854,1009 L 855,1010 L 857,1010 L 858,1011 L 859,1011 L 860,1012 L 860,1013 L 861,1014 L 861,1017 L 857,1021 L 854,1021 L 853,1022 L 852,1022 L 851,1021 L 847,1021 L 845,1019 L 844,1019 L 843,1018 L 843,1017 L 842,1016 L 842,1015 L 841,1014 L 841,1013 L 837,1013 L 837,1018 L 838,1019 L 838,1020 L 842,1024 L 843,1024 L 844,1025 L 847,1025 L 848,1026 L 856,1026 L 857,1025 L 859,1025 L 860,1024 L 861,1024 L 865,1020 L 865,1018 L 866,1017 L 866,1012 L 865,1011 L 865,1010 L 861,1006 L 860,1006 L 859,1005 L 856,1005 L 855,1004 L 852,1004 L 851,1003 L 849,1003 L 848,1002 L 846,1002 L 843,999 L 843,996 L 846,993 L 847,993 L 848,992 L 854,992 L 855,993 L 856,993 L 860,997 L 860,999 L 865,999 L 865,997 L 864,996 L 864,994 L 863,993 L 863,992 L 861,990 L 860,990 L 859,989 L 858,989 L 857,988 Z", "M 879,998 L 878,999 L 877,999 L 876,1000 L 875,1000 L 873,1002 L 873,1003 L 872,1004 L 872,1005 L 871,1006 L 871,1011 L 870,1012 L 870,1013 L 871,1014 L 871,1018 L 872,1019 L 872,1020 L 873,1021 L 873,1022 L 875,1024 L 876,1024 L 877,1025 L 879,1025 L 880,1026 L 886,1026 L 887,1025 L 889,1025 L 890,1024 L 891,1024 L 894,1021 L 894,1019 L 895,1018 L 895,1017 L 890,1017 L 889,1018 L 889,1019 L 887,1021 L 886,1021 L 885,1022 L 881,1022 L 880,1021 L 879,1021 L 877,1019 L 877,1018 L 876,1017 L 876,1016 L 875,1015 L 875,1014 L 876,1013 L 895,1013 L 895,1007 L 894,1006 L 894,1004 L 892,1002 L 892,1001 L 891,1001 L 889,999 L 888,999 L 887,998 Z M 876,1006 L 880,1002 L 886,1002 L 889,1005 L 889,1006 L 890,1007 L 890,1008 L 889,1009 L 877,1009 L 876,1008 Z", "M 901,988 L 901,1025 L 905,1025 L 905,988 Z", "M 925,988 L 917,988 L 916,989 L 915,989 L 914,990 L 914,991 L 913,992 L 913,998 L 912,999 L 909,999 L 909,1002 L 912,1002 L 913,1003 L 913,1025 L 918,1025 L 918,1003 L 919,1002 L 923,1002 L 923,999 L 919,999 L 918,998 L 918,994 L 920,992 L 924,992 L 924,991 L 925,990 Z", "M 928,1020 L 928,1025 L 933,1025 L 933,1020 Z"];

/**
 * ACT V — "The Realization" (100% Scroll-Scrubbed Haute-Couture Needle Ritual)
 *
 * Authentic Own Karma brand identity reveal.
 * Scrolling down drives a precision-crafted silver embroidery needle along unified SVG paths,
 * pulling warm gold silk thread to stitch:
 * 1. The sacred meditative/ascending human logomark
 * 2. The geometric bold wordmark "OWN KARMA"
 * 3. The tagline "Beyond Fashion. Beyond Self." flanked by horizon rules.
 */
export function Act05Realization({ onComplete, onBack, initialProgress = 0 }: Act05RealizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const emblemGroupRef = useRef<SVGGElement>(null);
  const lettersGroupRef = useRef<SVGGElement>(null);
  const taglineGroupRef = useRef<SVGGElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const shimmerStopRef = useRef<SVGStopElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const transitionFiredRef = useRef<boolean>(false);

  const [progress, setProgress] = useState<number>(0);

  // 1. Build Paused GSAP Stitching Timeline
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const emblemGroup = emblemGroupRef.current;
      const lettersGroup = lettersGroupRef.current;
      const taglineGroup = taglineGroupRef.current;
      const needle = needleRef.current;
      const shimmerStop = shimmerStopRef.current;

      if (!emblemGroup || !lettersGroup || !taglineGroup || !needle) return;

      const emblemPaths = Array.from(emblemGroup.querySelectorAll<SVGPathElement>("path"));
      const letterPaths = Array.from(lettersGroup.querySelectorAll<SVGPathElement>("path"));
      const taglinePaths = Array.from(taglineGroup.querySelectorAll<SVGPathElement>("path"));

      const allOrderedPaths = [...emblemPaths, ...letterPaths, ...taglinePaths];

      // Natural right-handed embroidery needle angle (body extends UP-RIGHT, tip leads down-left at 0,0)
      const calculateNeedleAngle = (path: SVGGeometryElement, len: number, at: number) => {
        const delta = Math.min(3, Math.max(1, len * 0.015));
        const a = Math.max(0, at - delta);
        const b = Math.min(len, at + delta);
        const pa = path.getPointAtLength(a);
        const pb = path.getPointAtLength(b);
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed < 0.001) return -38;
        // Subtle dynamic tilt (-46deg to -30deg) so needle body gracefully stays up and to the right
        const tilt = Math.max(-8, Math.min(8, (dx / speed) * 6));
        return -38 + tilt;
      };

      // Set needle position with needle tip strictly locked at (0, 0)
      const setNeedle = (x: number, y: number, angleDeg: number) => {
        gsap.set(needle, {
          x,
          y,
          rotation: angleDeg,
          transformOrigin: "0px 0px",
          opacity: 1,
        });
      };

      const moveNeedleTo = (
        tl: gsap.core.Timeline,
        x: number,
        y: number,
        duration: number,
        faceAngle: number
      ) => {
        tl.to(needle, {
          x,
          y,
          rotation: faceAngle,
          duration,
          ease: "sine.inOut",
        });
      };

      // Haute-couture stitching pacing
      const STITCH_SPEED = 450; // pixels per second

      const animatePathWithNeedle = (
        tl: gsap.core.Timeline,
        path: SVGPathElement,
        minDuration = 0.28
      ) => {
        const len = path.getTotalLength();
        const duration = Math.max(minDuration, len / STITCH_SPEED);

        const startPos = tl.duration();

        // 1. Reveal path stroke right as stitching starts
        tl.to(path, { opacity: 1, duration: 0.001 }, startPos);

        // 2. Simultaneously animate strokeDashoffset
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration,
            ease: "none",
          },
          startPos
        );

        // 3. Move needle in 100% lockstep with stroke drawing
        const obj = { progress: 0 };
        tl.to(
          obj,
          {
            progress: 1,
            duration,
            ease: "none",
            onUpdate: () => {
              const currentLen = Math.min(len, Math.max(0, len * obj.progress));
              const pt = path.getPointAtLength(currentLen);
              const angle = calculateNeedleAngle(path, len, currentLen);
              setNeedle(pt.x, pt.y, angle);
            },
          },
          startPos
        );

        // 4. Fill smoothly blooms in only after the shape is completely stitched
        tl.to(
          path,
          {
            fillOpacity: 1,
            duration: Math.min(0.4, duration * 0.4),
            ease: "power1.out",
          },
          `>${-Math.min(0.12, duration * 0.15)}`
        );
      };

      // Initial State: Hide all paths via strokeDashoffset & fillOpacity 0
      allOrderedPaths.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          fillOpacity: 0,
          opacity: 0,
        });
      });

      // Initial needle state
      gsap.set(needle, {
        opacity: 0,
        x: 526,
        y: 166,
        rotation: -38,
        transformOrigin: "0px 0px",
      });

      const tl = gsap.timeline({ paused: true });
      timelineRef.current = tl;

      // ==========================================
      // PHASE 1: Stitch Sacred Emblem Logomark
      // ==========================================
      emblemPaths.forEach((path, idx) => {
        const len = path.getTotalLength();
        const startPt = path.getPointAtLength(0);
        const startAngle = calculateNeedleAngle(path, len, 0);

        if (idx === 0) {
          tl.to(needle, {
            opacity: 1,
            x: startPt.x,
            y: startPt.y,
            rotation: startAngle,
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          moveNeedleTo(tl, startPt.x, startPt.y, 0.25, startAngle);
        }
        animatePathWithNeedle(tl, path, 0.45);
      });

      // ==========================================
      // PHASE 2: Stitch Primary Wordmark ("OWN KARMA")
      // ==========================================
      letterPaths.forEach((letterPath) => {
        const lLen = letterPath.getTotalLength();
        const lStart = letterPath.getPointAtLength(0);
        const lAngle = calculateNeedleAngle(letterPath, lLen, 0);

        moveNeedleTo(tl, lStart.x, lStart.y, 0.26, lAngle);
        animatePathWithNeedle(tl, letterPath, 0.38);
      });

      // ==========================================
      // PHASE 3: Stitch Tagline & Horizon Rules
      // ==========================================
      taglinePaths.forEach((tPath) => {
        const tLen = tPath.getTotalLength();
        const tStart = tPath.getPointAtLength(0);
        const tAngle = calculateNeedleAngle(tPath, tLen, 0);

        moveNeedleTo(tl, tStart.x, tStart.y, 0.16, tAngle);
        animatePathWithNeedle(tl, tPath, 0.2);
      });

      // Needle gracefully retreats off canvas
      tl.to(needle, {
        x: 1180,
        y: 1100,
        rotation: -40,
        opacity: 0,
        duration: 0.8,
        ease: "sine.inOut",
      });

      // Gold Shimmer Sweep across the completed brand crest
      if (shimmerStop) {
        tl.fromTo(
          shimmerStop,
          { offset: "0%" },
          { offset: "100%", duration: 2.0, ease: "power1.inOut" },
          "-=0.4"
        );
      }
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  // 2. 60fps RequestAnimationFrame Render Loop for Scrubbing GSAP Progress
  useEffect(() => {
    let active = true;
    let animFrame: number;

    const renderLoop = () => {
      if (!active) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.05;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const currentP = Math.min(1, Math.max(0, currentProgressRef.current));
      if (timelineRef.current) {
        timelineRef.current.progress(currentP);
      }

      animFrame = requestAnimationFrame(renderLoop);
    };

    animFrame = requestAnimationFrame(renderLoop);
    return () => {
      active = false;
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Automated progress timer (0 to 1 over 36s with auto transition on finish)
  useEffect(() => {
    const progressObj = { value: 0 };
    const tween = gsap.to(progressObj, {
      value: 1,
      duration: 36,
      ease: "none",
      onUpdate: () => {
        if (targetProgressRef.current < progressObj.value) {
          targetProgressRef.current = progressObj.value;
          setProgress(progressObj.value);
        }
      },
      onComplete: () => {
        if (!transitionFiredRef.current) {
          transitionFiredRef.current = true;
          setTimeout(() => {
            onComplete?.();
          }, 1500);
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [onComplete]);

  // 3. Scroll position listener mapping scroll track to target progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (initialProgress === 1) {
      requestAnimationFrame(() => {
        if (!container) return;
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll > 0) {
          container.scrollTop = maxScroll;
          targetProgressRef.current = 1;
          currentProgressRef.current = 1;
          setProgress(1);
        }
      });
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;

      const rawProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setProgress(rawProgress);
      targetProgressRef.current = rawProgress;

      if (rawProgress >= 0.985 && !transitionFiredRef.current) {
        transitionFiredRef.current = true;
        onComplete?.();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollTop <= 0 && e.deltaY < -15 && !transitionFiredRef.current) {
        transitionFiredRef.current = true;
        onBack?.();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const diffY = startY - e.touches[0].clientY;
      if (container.scrollTop <= 0 && diffY < -40 && !transitionFiredRef.current) {
        transitionFiredRef.current = true;
        onBack?.();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onComplete, onBack, initialProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#060807] select-none overflow-hidden"
      aria-label="Act V: The Realization"
    >
      {/* Deep Emerald / Gold Ambient Luxury Atmosphere */}
      <div className="absolute w-[700px] h-[700px] bg-radial from-[#DFC878]/12 via-[#163A2B]/20 to-transparent pointer-events-none filter blur-3xl opacity-70" />

      {/* SVG Canvas containing Needle, Real Own Karma Brand Crest in (1184x1184) Space */}
      <div className="relative w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] md:w-[620px] md:h-[620px] flex items-center justify-center pointer-events-none z-10">
        <svg
          viewBox="0 0 1184 1184"
          className="w-full h-full filter drop-shadow-[0_0_24px_rgba(223,200,120,0.35)]"
          fill="none"
        >
          <defs>
            {/* Gold Shimmer Sweep Gradient */}
            <linearGradient id="goldShimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5E8C7" stopOpacity="0.95" />
              <stop ref={shimmerStopRef} offset="0%" stopColor="#FFF4D0" stopOpacity="1" />
              <stop offset="100%" stopColor="#DFC878" stopOpacity="0.95" />
            </linearGradient>

            {/* Sacred Gold Fill Gradient */}
            <linearGradient id="goldFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7EAC8" />
              <stop offset="50%" stopColor="#DFC878" />
              <stop offset="100%" stopColor="#C4A853" />
            </linearGradient>

            {/* Precision Polished Steel Metallic Gradient */}
            <linearGradient id="needleMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#F1F5F9" />
              <stop offset="60%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* 1. Sacred Emblem: The Ascending Meditative Glyph */}
          <g
            ref={emblemGroupRef}
            stroke="url(#goldShimmerGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#goldFillGrad)"
          >
            {EMBLEM_PATHS.map((d, i) => (
              <path key={`emblem-${i}`} d={d} fillRule="evenodd" />
            ))}
          </g>

          {/* 2. Primary Wordmark: "OWN KARMA" */}
          <g
            ref={lettersGroupRef}
            stroke="url(#goldShimmerGrad)"
            strokeWidth="3.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#goldFillGrad)"
          >
            {LETTER_PATHS.map((d, i) => (
              <path key={`letter-${i}`} d={d} fillRule="evenodd" />
            ))}
          </g>

          {/* 3. Tagline & Flanking Horizon Rules: "— Beyond Fashion. Beyond Self. —" */}
          <g
            ref={taglineGroupRef}
            stroke="url(#goldShimmerGrad)"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#goldFillGrad)"
          >
            <path d={RULE_LEFT_PATH} fillRule="evenodd" />
            {TAGLINE_PATHS.map((d, i) => (
              <path key={`tagline-${i}`} d={d} fillRule="evenodd" />
            ))}
            <path d={RULE_RIGHT_PATH} fillRule="evenodd" />
          </g>

          {/* Precision Haute-Couture Embroidery Needle (Tip at 0,0 touching line, body floats up-right) */}
          <g ref={needleRef} className="pointer-events-none">
            {/* Tapered Needle Blade extending to +X */}
            <path
              d="M 0,0 L 14,-1.8 L 36,-3.2 L 52,-2.2 C 55,-2 58,-1 58,0 C 58,1 55,2 52,2.2 L 36,3.2 L 14,1.8 Z"
              fill="url(#needleMetal)"
              filter="drop-shadow(0 3px 6px rgba(0,0,0,0.9))"
            />
            {/* Needle Eyelet */}
            <ellipse cx="48" cy="0" rx="3.5" ry="1.2" fill="#060807" />
            {/* Trailing Gold Silk Thread flowing up and away */}
            <path
              d="M 48,0 C 68,-10 90,-6 120,-22 C 145,-34 170,-24 200,-42"
              stroke="#F5E8C7"
              strokeWidth="2.0"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            {/* Active Contact Spark at exact Needle Tip (0,0) */}
            <circle
              cx="0"
              cy="0"
              r="2.5"
              fill="#FFFFFF"
              className="filter drop-shadow-[0_0_6px_#FFF4D0]"
            />
            <circle cx="0" cy="0" r="1.2" fill="#FFFBEB" />
          </g>
        </svg>
      </div>

      {/* Scrollable Track Container */}
      <div
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-auto z-20 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="h-[400vh] w-full relative" />
      </div>
    </div>
  );
}

