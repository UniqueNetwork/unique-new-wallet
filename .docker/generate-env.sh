#!/bin/sh

# Will generate a js file with all ENVs that start with REACT_APP_

# Check if the output file argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <output_file>"
    exit 1
fi

# Output file
output_file="$1"

# Open the output file for writing
echo "(function (w) {" > "$output_file"
echo "    w.ENV = w.ENV || {};" >> "$output_file"

# Loop through all environment variables
for var in $(env | cut -d= -f1); do
    # Check if the variable starts with "REACT_APP_"
    case "$var" in
        REACT_APP_*)
            value=$(eval "echo \$$var")
            # Escape single quotes in the value
            value=$(printf "%s" "$value" | sed "s/'/'\\\\''/g")
            echo "    w.ENV.$var = '$value';" >> "$output_file"
            ;;
    esac
done

# Close the output file
echo "})(this);" >> "$output_file"

echo "JavaScript environment file generated: $output_file"
