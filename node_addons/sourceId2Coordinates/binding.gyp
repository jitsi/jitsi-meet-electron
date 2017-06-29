{
    'targets': [{
        'target_name': 'sourceId2Coordinates',
        'include_dirs': [
            "<!(node -e \"require('nan')\")"
        ],

        'cflags': [
            '-Wall',
            '-Wparentheses',
            '-Winline',
            '-Wbad-function-cast',
            '-Wdisabled-optimization'
        ],

        'conditions': [
            ["OS=='win'", {
                'defines': ['IS_WINDOWS']
            }]
        ],

        'sources': [
            'src/index.cc',
            'src/sourceId2Coordinates.cc'
        ]
    }]
}
