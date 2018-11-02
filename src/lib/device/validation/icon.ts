const AVAILABLE_ICON_NAMES = ['sonos', 'neeo-brain'];

export function getIcon(name: string) {
  if (name) {
    name = name.toLowerCase();
  }
  if (!AVAILABLE_ICON_NAMES.includes(name)) {
    throw new Error(`INVALID_ICON_NAME: ${name}`);
  }
  return name;
}
