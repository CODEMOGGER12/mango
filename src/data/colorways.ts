export type Colorway = {
  id: string
  name: string
  /** clay color of the rounded base */
  base: string
  /** clay color of the sculpted piece on top */
  top: string
  /** full-bleed color used when this colorway owns a section */
  field: string
  /** type color that reads on the field */
  ink: string
  note: string
  baseName: string
  topName: string
  /** seed for the hand-made variation in this colorway's geometry */
  seed: number
}

export const PRICE = 12
export const CURRENCY = '¥'
export const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString('en-US')}`

export const COLORWAYS: Colorway[] = [
  { id: 'vanilla', baseName: 'Charcoal', topName: 'Cream', name: 'Vanilla', base: '#383533', top: '#EFE8DA', field: '#26231F', ink: '#EFE8DA', note: 'Cream on charcoal. Quiet, then not.', seed: 11 },
  { id: 'matcha', baseName: 'Sage', topName: 'Cream', name: 'Matcha', base: '#9CAF88', top: '#EEE6D2', field: '#B8C6A6', ink: '#1F2A18', note: 'Sage and cream, like a slow morning.', seed: 23 },
  { id: 'strawberry', baseName: 'Soft pink', topName: 'Red', name: 'Strawberry', base: '#F2B6BC', top: '#D6323B', field: '#F8D0D3', ink: '#7E151C', note: 'Soft pink with a red streak of nerve.', seed: 37 },
  { id: 'ocean', baseName: 'Blue', topName: 'Pale aqua', name: 'Ocean', base: '#2E6DB2', top: '#A9DDDA', field: '#235895', ink: '#D5F1EE', note: 'Deep blue holding a little shallow water.', seed: 41 },
  { id: 'lavender', baseName: 'Purple', topName: 'Lilac', name: 'Lavender', base: '#7A5DA6', top: '#CFBBE7', field: '#9178BA', ink: '#EFE4FA', note: 'Purple below, lilac above. Calm, a bit dramatic.', seed: 53 },
  { id: 'sunset', baseName: 'Coral', topName: 'Orange', name: 'Sunset', base: '#EE6E5C', top: '#F6A13B', field: '#F58D70', ink: '#3B120B', note: 'Coral meets orange at the end of the day.', seed: 67 },
  { id: 'peach', baseName: 'Peach', topName: 'Yellow', name: 'Peach', base: '#F3AC78', top: '#F6D923', field: '#F7C69E', ink: '#4A2A0E', note: 'Peach and yellow. Warm by the door.', seed: 71 },
  { id: 'midnight', baseName: 'Navy', topName: 'White', name: 'Midnight', base: '#1F2A4D', top: '#F3F2EE', field: '#151C35', ink: '#F3F2EE', note: 'Navy with a white mark, like a late idea.', seed: 83 },
  { id: 'lemon', baseName: 'Yellow', topName: 'Orange', name: 'Lemon', base: '#F4D23A', top: '#EF8723', field: '#F8E074', ink: '#6B2E05', note: 'Bright yellow, orange twist. Loud on a white wall.', seed: 97 },
  { id: 'cocoa', baseName: 'Brown', topName: 'Beige', name: 'Cocoa', base: '#6A4431', top: '#D9C3A4', field: '#523323', ink: '#F0E1CB', note: 'Brown and beige. The cozy one.', seed: 103 },
]

export const byId = (id: string) => COLORWAYS.find((c) => c.id === id) ?? COLORWAYS[0]
