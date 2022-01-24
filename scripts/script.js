require([
    'esri/Map',
    'esri/views/SceneView',
    'dijit/form/Button',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/widgets/Legend',
    'esri/widgets/LayerList',
], (Map, SceneView, Button, FeatureLayer, GraphicsLayer, Legend, LayerList) => {

    const map1 = new Map({
        basemap: "topo-vector"
    });

    const view = new SceneView({
        map: map1,
        container: "mapDiv",
        zoom: 3,
        center: [-96.06326, 33.759]
    });

    const zoomIn = new Button({
        onclick: () => {
            view.zoom = view.zoom + 1;
        }
    }, "zoomIn");

    const zoomOut = new Button({
        onclick: () => {
            view.zoom = view.zoom - 1;
        }
    }, "zoomOut");

    // warstwy

    const g1 = new GraphicsLayer({
        title: "Magnitude > 4"
    });

    const f1 = new FeatureLayer({
        url: 'https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0',
        title: "mm"
    });

    const f2 = new FeatureLayer({
        url: 'https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0'
    });

    //map1.add(f1);
    map1.add(f2);
    map1.add(g1);

    //query
    let query = f1.createQuery();
    query.where = "MAGNITUDE > 4";
    query.outFields = ['*'];
    query.returnGeometry = true;

    f1.queryFeatures(query)
    .then(response => {
        console.log(response);
        getResults(response.features);
    })
    .catch(err => {
        console.log(err)
    })

    const getResults = (features) => {
        const symbol = {
            type: 'simple-marker',
            size: 15,
            color: "yellow",
            style: "square",
        };

        features.map(elem => {
            elem.symbol = symbol;
        });

        g1.addMany(features)

    };

    const renderer = {
        type: "simple",
        symbol: {
            type: 'point-3d',
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        primitive: "cylinder"
                    },
                }

            ]
        },
        label: 'Earthquakes',
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0.5,
                        color: "green"
                    },
                    {
                        value: 4.48,
                        color: "red"
                    }
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                width: 10,
                stops: [
                    {
                        value: -3.39,
                        size: 100000,
                    },

                    {
                        value: 30.97,
                        size: 300000,
                    }
                ]
            }
        ]
    };

    f2.renderer = renderer;

    const legend = new Legend({
        view: view,
    });
    view.ui.add(legend, {position: "bottom-right"});

    const layerList = new LayerList({
        view: view,
    });

    view.ui.add(layerList, {
        position: "bottom-left",
    });



});
