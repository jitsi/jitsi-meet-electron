#include <node.h>
#include <nan.h>
#include <v8.h>
#include <stdio.h>
#include "sourceId2Coordinates.h"

using namespace v8;

NAN_METHOD(sourceId2Coordinates)
{
	const int sourceID = info[0]->Int32Value();
	Local<Object> obj = Nan::New<Object>();
	Point coordinates;
	if(!sourceId2Coordinates(sourceID, &coordinates))
	{ // return undefined if sourceId2Coordinates function fail.
		info.GetReturnValue().Set(Nan::Undefined());
	}
	else
	{ // return the coordinates if sourceId2Coordinates function succeed.
		Nan::Set(obj, Nan::New("x").ToLocalChecked(), Nan::New(coordinates.x));
		Nan::Set(obj, Nan::New("y").ToLocalChecked(), Nan::New(coordinates.y));
		info.GetReturnValue().Set(obj);
	}
}

NAN_MODULE_INIT(Init)
{
	Nan::Set(
		target,
		Nan::New("sourceId2Coordinates").ToLocalChecked(),
		Nan::GetFunction(Nan::New<FunctionTemplate>(sourceId2Coordinates))
			.ToLocalChecked()
	);
	NAN_EXPORT(target, sourceId2Coordinates);
}

NODE_MODULE(sourceId2CoordinatesModule, Init)
