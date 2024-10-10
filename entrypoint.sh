#!/bin/bash

sed -i "s|<\!-- apiurl -->|<script>window.apiUrl = '$API_URL'</script>|" index.html
nginx -g 'daemon off;'