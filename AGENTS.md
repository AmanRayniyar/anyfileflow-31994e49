# Architecture rules

- Select banner formats by measured slot width, with a fixed rectangle for sidebars; this prevents clipped ads and hidden duplicate requests.
- Keep banners separate from tool controls; custom banner overlays open once after five seconds per tool visit, allow immediate cancellation, and are not provider-supported vignettes.
- Keep aggregate tool statistics publicly readable but deny direct visitor writes; the existing view-count function and rating trigger maintain them without allowing arbitrary edits.