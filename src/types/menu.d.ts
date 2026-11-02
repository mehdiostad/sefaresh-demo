interface MenuProps {
  _id?: number | string;
  logo?: string; // logo image path
  items: ItemProps[]; // array of menu items
  title: string;
  subTitle?: string;
  textColor?: string; // text color for the menu
  themeFont?: string; // font family for the menu
  cardProps?: string; // additional card properties
  menuIcon?: React.ElementType | string; // icon for the menu
  firstTitle?: string;
  secondTitle?: string;
  pattern?:string;
  backgroundImage?: string;
  desc?: string;
  downerImage?: boolean;
  downerImageProps?: DownerImageProps;
  topDrawrerImage?: string;
  itemCn?:string;
  modalBtnColor?:string
  topDrawrerImageProps?: {
    cn?: string;
    float?: boolean; 
  }
  bottomLeftImage?: string;
  bottomLeftImageProps?: {
    cn?: string;
    float?: boolean; 
    
  }
  bottomRightImageProps?: {
    cn?: string
    float?: boolean; 
  }
  bottomRightImage?: string;
  drawerText?: string;
  color?: string;
  header?: {
    color?: string;
    title?: string;
  };
  isInteracted?: boolean;
  pageNumber?: number;
}

interface PreviewMenuProps extends MenuProps {
  items?: [];
  title?: "";
  subTitle?: string;
  hexColor?: {
    fromColor: string;
    toColor: string;
  };
}
